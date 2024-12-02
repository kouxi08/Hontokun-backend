import { MySql2Database } from 'drizzle-orm/mysql2';
import { QuizSet } from '../model/quiz/quizSet';

export const getQuizSetByTier = async (
  db: MySql2Database,
  userId: string,
  tier: QuizSet['tier']
): Promise<QuizSet> => {};
