import type { InferInsertModel } from 'drizzle-orm';
import { sql, eq } from 'drizzle-orm';
import type { MySql2Database } from 'drizzle-orm/mysql2';
import { convertDatabaseToQuiz } from '../core/converter/database/quizMapper.js';
import { quizChoiceTable, quizTable } from '../database/mysql/schema/schema.js';
import {
  insertQuizChoiceSchema,
  insertQuizSchema,
} from '../database/mysql/validators/quizValidator.js';
import type { Quiz } from '../model/quiz/quiz';

export const createQuiz = async (
  db: MySql2Database,
  quiz: Quiz
): Promise<void> => {
  const validatedQuiz = insertQuizSchema.parse(quiz.toJSON());
  const validatedChoice: InferInsertModel<typeof quizChoiceTable>[] =
    quiz.choices.map((choice) => {
      return insertQuizChoiceSchema.parse({
        ...choice.toJSON(),
        quizId: quiz.id,
      });
    });

  if (!validatedQuiz || (quiz.choices && !validatedChoice)) {
    throw new Error('Invalid quiz data');
  }

  await db.transaction(async (trx) => {
    await trx.insert(quizTable).values([validatedQuiz]);
    if (validatedChoice) {
      await Promise.all(
        validatedChoice.map((choice) =>
          trx.insert(quizChoiceTable).values([choice])
        )
      );
    }
  });

  return;
};

export const getQuizzesByTier = async (
  db: MySql2Database,
  tier: number,
  solvedQuizIds: string[]
): Promise<Quiz[]> => {
  let whereCondition = eq(quizTable.tier, tier);
  // if (solvedQuizIds.length > 0) {
  //   whereCondition = sql`${eq(quizTable.tier, tier)} AND ${quizTable.id} NOT IN (${sql.join(
  //     solvedQuizIds.map((id) => sql`${id}`)
  //   )})`;
  // }

  // ランダムで３件のクイズのquiz_id取得
  const quizzes = await db
    .select({ id: quizTable.id })
    .from(quizTable)
    .where(whereCondition)
    .orderBy(sql`RAND()`)
    .limit(3);

  // クイズの詳細取得
  const quizList = await Promise.all(
    quizzes.map(async (quiz) => {
      return await db
        .select({ quiz: quizTable, choice: quizChoiceTable })
        .from(quizTable)
        .leftJoin(quizChoiceTable, eq(quizTable.id, quizChoiceTable.quizId))
        .where(eq(quizTable.id, quiz.id));
    })
  );
  const result = convertDatabaseToQuiz(quizList);
  return result;
};

export const updateQuiz = async (
  db: MySql2Database,
  quiz: Quiz
): Promise<void> => {
  const validatedQuiz = insertQuizSchema.parse(quiz.toJSON());
  const validatedChoice = quiz.choices.map((choice) =>
    insertQuizChoiceSchema.parse({
      ...choice.toJSON(),
      quizId: quiz.id,
    })
  );

  await db.transaction(async (trx) => {
    await trx
      .insert(quizTable)
      .values([validatedQuiz])
      .onDuplicateKeyUpdate({ set: validatedQuiz });
    await trx
      .delete(quizChoiceTable)
      .where(eq(quizChoiceTable.quizId, validatedQuiz.id));
    await Promise.all(
      validatedChoice.map((choice) =>
        trx.insert(quizChoiceTable).values([choice])
      )
    );
  });

  return;
};

/**
 * クイズデータをIDから取得
 * @param db データベースのインスタンス
 * @param quizId クイズID
 * @returns Quiz クイズデータ
 */
export const getQuizById = async (
  db: MySql2Database,
  quizId: string
): Promise<Quiz | undefined> => {
  const quiz = await db
    .select({ quiz: quizTable, choice: quizChoiceTable })
    .from(quizTable)
    .leftJoin(quizChoiceTable, eq(quizTable.id, quizChoiceTable.quizId))
    .where(eq(quizTable.id, quizId));
  if (!quiz) {
    return undefined;
  }
  const convertedData = convertDatabaseToQuiz([quiz]);
  return convertedData[0];
};

/**
 * クイズIDから難易度を取得
 * @param db データベースのインスタンス
 * @param id クイズID
 * @returns 難易度
 */
export const getQuizByTier = async (
  db: MySql2Database,
  id: string
): Promise<number | undefined> => {
  const data = await db
    .select({ tier: quizTable.tier })
    .from(quizTable)
    .where(eq(quizTable.id, id));

  return data[0]?.tier ?? undefined;
};
