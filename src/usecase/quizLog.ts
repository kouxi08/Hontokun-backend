import { MySql2Database } from "drizzle-orm/mysql2";
import * as QuizRepository from "../repository/quiz";

export type Answer = {
  quizId: string,
  answer: string,
  answerTime: number,
}

export const createQuizLog = async (
  db: MySql2Database,
  userId: string,
  answers: Answer[],
): Promise<void> => {
  for (const answer of answers) {
    // クイズデータをDBから取得
    const quiz = await QuizRepository.getQuizById(db, answer.quizId);
    console.log(JSON.stringify(quiz, null, 2));
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    // TODO: DBにquizLogを保存
    // TODO: 正解したらポイント加算(tierの数を加算、1レベル10ポイント)
  }
  return;
}