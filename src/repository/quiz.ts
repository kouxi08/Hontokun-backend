import { MySql2Database } from 'drizzle-orm/mysql2';
import { QuizSet } from '../model/quiz/quizSet';
import { sql } from 'drizzle-orm';

export const getQuizzesByTier = async (
  db: MySql2Database,
  tier: QuizSet['tier']
): Promise<QuizSet> => {
  // const quizzes = await db.select().from(quizTable).orderBy().limit(3).execute();
  const quizzes: QuizSet = await db.execute(sql`
    SELECT * FROM ${quizTable} WHERE tier = ${tier} ORDER BY RAND() LIMIT 3
  `);

  return quizzes;
};
