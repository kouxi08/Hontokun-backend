import { MySql2Database } from 'drizzle-orm/mysql2';
import { quizChoiceTable, quizTable } from '../database/mysql/schema/schema';
import {
  insertQuizChoiceSchema,
  insertQuizSchema,
} from '../database/mysql/validators/quizValidator';
import { QuizSet } from '../model/quiz/quizSet';
import { sql } from 'drizzle-orm';
import { Quiz } from '../model/quiz/quiz';
import { eq } from 'drizzle-orm';

export const createQuiz = async (
  db: MySql2Database,
  quiz: Quiz
): Promise<void> => {
  const validatedQuiz = insertQuizSchema.parse(quiz.toDatabaseObject());

  const choices = quiz.getChoices().map((choice) => {
    return {
      quiz_id: validatedQuiz.id,
      name: choice,
      created_at: validatedQuiz.created_at,
      updated_at: validatedQuiz.updated_at,
    };
  });
  const validatedChoice = choices.map((choice) => insertQuizChoiceSchema.parse(choice));

  if (!validatedQuiz || !validatedChoice) {
    throw new Error();
  }

  await db.transaction(async (trx) => {
    await trx.insert(quizTable).values([validatedQuiz]);
    await Promise.all(
      validatedChoice.map((choice) => trx.insert(quizChoiceTable).values([choice]))
    );
  });
  
  return;
};

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

export const updateQuiz = async (
  db: MySql2Database,
  quiz: Quiz
): Promise<void> => {
  const validatedQuiz = insertQuizSchema.parse(quiz.toDatabaseObject());

  const choices = quiz.getChoices().map((choice) => {
    return {
      quiz_id: validatedQuiz.id,
      name: choice,
      created_at: validatedQuiz.created_at,
      updated_at: validatedQuiz.updated_at,
    };
  });
  const validatedChoice = choices.map((choice) => insertQuizChoiceSchema.parse(choice));

  await db.transaction(async (trx) => {
    await trx.update(quizTable).set(validatedQuiz).where(eq(quizTable.id, validatedQuiz.id));
    await trx.delete(quizChoiceTable).where(eq(quizChoiceTable.quiz_id, validatedQuiz.id));
    await Promise.all(
      validatedChoice.map((choice) => trx.insert(quizChoiceTable).values([choice]))
    );
  });
  
  return;
}