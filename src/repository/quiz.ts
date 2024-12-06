import { MySql2Database } from 'drizzle-orm/mysql2';
import { quizTable } from '../database/mysql/schema/schema';
import { insertQuizSchema } from '../database/mysql/validators/quizValidator';
import { z } from 'zod';
import { Quiz } from '../model/quiz/quiz';

export const createQuiz = async (
  db: MySql2Database,
  quiz: Quiz
): Promise<void> => {
  try {
    const validatedQuiz = insertQuizSchema.parse(quiz.toDatabaseObject());
    if (!validatedQuiz) {
      throw new Error();
    }

    await db.insert(quizTable).values([validatedQuiz]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Zod Validation Error:', error.issues);
      throw new Error('Zod Validation Error');
    } else {
      console.error('Failed to create quiz:', error);
      throw new Error('Failed to create quiz');
    }
  }

  return;
};
