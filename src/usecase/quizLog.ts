import { MySql2Database } from "drizzle-orm/mysql2";
import * as QuizRepository from "../repository/quiz";
import * as QuizLogRepository from "../repository/quizLog";
import * as QuizModeRepository from "../repository/quizMode";

export type Answer = {
  quizId: string,
  answer: string,
  answerTime: number,
  isCorrect?: boolean,
}

export const createQuizLog = async (
  db: MySql2Database,
  userId: string,
  quizMode: string,
  answers: Answer[],
): Promise<void> => {
  for (const answer of answers) {
    // クイズデータをDBから取得
    const quizData = await QuizRepository.getQuizById(db, answer.quizId);
    if (!quizData) {
      throw new Error('Quiz not found');
    }

    // 回答が正しいか判定
    answers.forEach((answer) => {
      answer.isCorrect = answer.answer === quizData.answer;
    })

    // DBにログを保存
    const modeId = await QuizModeRepository.getQuizModeId(db, quizMode);
    const response = await QuizLogRepository.createQuizLog(db, userId, modeId, answers);
    // TODO: 正解したらポイント加算(tierの数を加算、1レベル10ポイント)
  }
  // TODO: クイズのデータを返却
  return;
}