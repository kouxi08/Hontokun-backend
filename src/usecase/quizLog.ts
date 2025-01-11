import { MySql2Database } from "drizzle-orm/mysql2";
import * as QuizRepository from "../repository/quiz";
import * as QuizLogRepository from "../repository/quizLog";
import * as QuizModeRepository from "../repository/quizMode";
import { Quiz, QuizParams } from "../model/quiz/quiz";

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
 * @param userId ユーザID
 * @param quizMode クイズモード名
 * @param answers 解答データ
 * @returns クイズセットID, 正答率, クイズデータのリスト
 */
export const createQuizLog = async (
  db: MySql2Database,
  userId: string,
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

    // TODO: 正解したらポイント加算(tierの数を加算、1レベル10ポイント)
  }
  // DBにログを保存
  const modeId = await QuizModeRepository.getQuizModeId(db, quizMode);
  const { quizSetLog, quizLogs } = await QuizLogRepository.createQuizLog(db, userId, modeId, answers);
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