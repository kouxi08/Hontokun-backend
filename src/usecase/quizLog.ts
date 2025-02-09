import type { MySql2Database } from 'drizzle-orm/mysql2';
import { MAX_TIER } from '../core/constants.js';
import { formatTimeAgo } from '../core/formatDate.js';
import type { Quiz, QuizParams } from '../model/quiz/quiz';
import type { User } from '../model/user/user';
import * as QuizRepository from '../repository/quiz.js';
import * as QuizLogRepository from '../repository/quizLog.js';
import * as QuizModeRepository from '../repository/quizMode.js';
import * as UserUsecase from './user.js';

export type Answer = {
  quizId: string;
  order: number;
  answer: string;
  answerTime?: number;
  isCorrect?: boolean;
};

export type QuizData = Quiz &
  Partial<Pick<QuizLog, 'userAnswer' | 'answerTime' | 'isCorrect'>>;

/**
 * クイズの回答を受け取り、ログを作成する
 * @param db データベースのインスタンス
 * @param user ユーザデータ
 * @param quizModeId クイズモード名
 * @param answers 解答データ
 * @returns クイズセットID, 正答率, クイズデータのリスト
 */
export const createQuizLog = async (
  db: MySql2Database,
  user: User,
  quizModeId: number,
  answers: Answer[]
) => {
  const quizList: QuizParams[] = [];
  for (const answer of answers) {
    // クイズデータをDBから取得
    const quizData = await QuizRepository.getQuizById(db, answer.quizId);
    if (!quizData) {
      throw new Error('Quiz not found');
    }
    quizList.push({ ...quizData.toJSON() });
    answer.isCorrect = quizData.answer === answer.answer;

    // 正解したら経験値ポイント加算
    if (answer.isCorrect) {
      await UserUsecase.updateUserExp(db, user, quizData.tier);
    }
  }
  // DBにログを保存
  const { quizSetLog, quizLogs } = await QuizLogRepository.createQuizLog(
    db,
    user.id,
    quizModeId,
    answers
  );
  quizLogs.map((log) => {
    const quiz = quizList.find((quiz) => quiz.id === log.quizId);
    if (quiz) {
      Object.assign(quiz, {
        order: log.order,
        isCorrect: log.isCorrect,
        userAnswer: log.userAnswer,
        answerTime: log.time,
      });
    }
  });
  const accuracy =
    quizLogs.filter((log) => log.isCorrect).length / quizLogs.length;

  return { quizSetId: quizSetLog.id, accuracy, quizList };
};

/**
 * ユーザIDからクイズログ・クイズ情報を全て取得する
 * @param db データベースのインスタンス
 * @param userId ユーザID
 * @returns quizSetLogのリスト
 */
export const getAllQuizLog = async (db: MySql2Database, userId: string) => {
  type QuizSetLog = {
    id: string;
    accuracy: number;
    mode: string;
    answeredAt: string;
  };

  type TierList = {
    tier: number;
    accuracy: number;
    quizSetList: QuizSetLog[];
  };

  // クイズセットを取得
  const quizSetLogs = await QuizLogRepository.getQuizSet(db, userId);

  // 難易度別にまとめる
  const response: TierList[] = new Array(MAX_TIER).fill(1).map((_, i) => {
    return {
      tier: i + 1,
      accuracy: 0,
      quizSetList: [],
    };
  });

  for (const quizSetLog of quizSetLogs) {
    const quizLogs = await QuizLogRepository.getQuizLogBySetId(
      db,
      quizSetLog.id
    );

    const tier = await QuizRepository.getQuizByTier(db, quizLogs[0]?.quizId!);
    if (!tier) {
      throw new Error('Quiz not found');
    }

    const mode = await QuizModeRepository.getQuizModeName(
      db,
      quizSetLog.quizModeId
    );

    // responseのtierに対応する配列に追加
    const data = response.find((res) => res.tier === tier);
    if (!data) {
      throw new Error('Tier not found');
    }

    const answeredAt = formatTimeAgo(quizSetLog.createdAt);
    if (!answeredAt) {
      throw new Error('Invalid date: answeredAt');
    }

    data.quizSetList.push({
      id: quizSetLog.id,
      accuracy:
        (quizLogs.filter((log) => log.isCorrect).length / quizLogs.length) *
        100,
      mode,
      answeredAt: answeredAt,
    });

    response.push(data);
  }
  return response;
};

/**
 * クイズセットIDからクイズセットの詳細を取得する
 * @param db データベースのインスタンス
 * @param quizSetId クイズセットのID
 */
export const getQuizSetDetail = async (
  db: MySql2Database,
  userId: string,
  quizSetId: string
) => {
  // TODO: ユーザがクイズセットを解いたか確認

  // クイズセット内容を取得
  const quizSet = await QuizLogRepository.getQuizSetLogById(db, quizSetId);
  if (!quizSet) {
    throw new Error('Quiz set not found');
  }
  // クイズモード名を取得
  const quizMode = await QuizModeRepository.getQuizModeName(
    db,
    quizSet.quizModeId
  );

  // クイズログ取得
  const quizLogs = await QuizLogRepository.getQuizLogBySetId(db, quizSetId);
  // 正答率計算
  const accuracy =
    (quizLogs.filter((log) => log.isCorrect).length / quizLogs.length) * 100;

  // クイズ取得
  const quizList = await Promise.all(
    quizLogs.map(async (log) => {
      const quiz = await QuizRepository.getQuizById(db, log.quizId);
      if (!quiz) {
        throw new Error('Quiz not found');
      }
      return {
        ...quiz.toJSON(),
        isCorrect: quiz.answer === log.userAnswer,
        userAnswer: log.userAnswer,
      };
    })
  );
  if (!quizList) {
    throw new Error('Quiz list not found');
  }

  return { ...quizSet, mode: quizMode, accuracy: accuracy, quizList };
};
