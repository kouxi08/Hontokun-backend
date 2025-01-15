import { MySql2Database } from "drizzle-orm/mysql2";
import * as QuizRepository from "../repository/quiz";
import * as QuizLogRepository from "../repository/quizLog";
import * as QuizModeRepository from "../repository/quizMode";
import * as UserUsecase from "./user";
import { Quiz, QuizParams } from "../model/quiz/quiz";
import { User } from "../model/user/user";

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