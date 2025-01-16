import { MySql2Database } from "drizzle-orm/mysql2";
import * as QuizRepository from "../repository/quiz";
import * as QuizLogRepository from "../repository/quizLog";
import * as QuizModeRepository from "../repository/quizMode";
import * as UserUsecase from "./user";
import { Quiz, QuizParams } from "../model/quiz/quiz";
import { User } from "../model/user/user";
import { MAX_TIER } from "../core/constants";
import { formatDate } from "../core/formatDate";

export type Answer = {
  quizId: string,
  answer: string,
  answerTime: number,
  isCorrect?: boolean,
}

export type QuizData = Quiz & Partial<Pick<QuizLog, 'userAnswer' | 'answerTime' | 'isCorrect'>>;

/**
 * クイズの回答を受け取り、ログを作成する
 * @param db データベースのインスタンス
 * @param user ユーザデータ
 * @param quizMode クイズモード名
 * @param answers 解答データ
 * @returns クイズセットID, 正答率, クイズデータのリスト
 */
export const createQuizLog = async (
  db: MySql2Database,
  user: User,
  quizMode: string,
  answers: Answer[],
): Promise<{
  quizSetId: string,
  accuracy: number,
  quizList: QuizParams[]
}> => {
  let quizList: QuizParams[] = [];
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
  const modeId = await QuizModeRepository.getQuizModeId(db, quizMode);
  const { quizSetLog, quizLogs } = await QuizLogRepository.createQuizLog(db, user.id, modeId, answers);
  quizLogs.map((log) => {
    const quiz = quizList.find((quiz) => quiz.id === log.quizId);
    if (quiz) {
      Object.assign(quiz, {
        isCorrect: log.isCorrect,
        userAnswer: log.userAnswer,
        answerTime: log.time,
      })
    }
  });
  const accuracy = quizLogs.filter((log) => log.isCorrect).length / quizLogs.length;

  return { quizSetId: quizSetLog.id, accuracy, quizList };
}

/**
 * ユーザIDからクイズログ・クイズ情報を全て取得する
 * @param db データベースのインスタンス
 * @param userId ユーザID
 * @returns quizSetLogのリスト
 */
export const getAllQuizLog = async (
  db: MySql2Database,
  userId: string,
) => {
  type QuizSetLog = {
    id: string,
    accuracy: number,
    mode: string,
    answeredAt: string,
  };

  type TierList = {
    tier: number,
    accuracy: number,
    quizSetList: QuizSetLog[]
  }

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
    const quizLogs = await QuizLogRepository.getQuizLogBySetId(db, quizSetLog.id);

    const tier = await QuizRepository.getQuizByTier(db, quizLogs[0]?.quizId!);
    if (!tier) { throw new Error('Quiz not found'); }

    const mode = await QuizModeRepository.getQuizModeName(db, quizSetLog.quizModeId);

    // responseのtierに対応する配列に追加
    let data = response.find((res) => res.tier === tier);
    if (!data) {
      throw new Error('Tier not found');
    }
    data.quizSetList.push({
      id: quizSetLog.id,
      accuracy: quizLogs.filter((log) => log.isCorrect).length / quizLogs.length * 100,
      mode,
      // yyyy-mm-dd hh:mm:ssに変換
      answeredAt: formatDate(quizSetLog.createdAt),
    })

  }
  return response;
};