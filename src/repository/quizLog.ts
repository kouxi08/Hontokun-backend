import { eq } from 'drizzle-orm';
import type { MySql2Database } from 'drizzle-orm/mysql2';
import {
  quizLogTable,
  quizSetLogTable,
} from '../database/mysql/schema/schema.js';
import type { InsertQuizLogType } from '../database/mysql/validators/quizLogValidator';
import { insertQuizLogSchema } from '../database/mysql/validators/quizLogValidator.js';
import type { InsertQuizSetLogType } from '../database/mysql/validators/quizSetLogValidator';
import { insertQuizSetLogSchema } from '../database/mysql/validators/quizSetLogValidator.js';
import type { Answer } from '../usecase/quizLog';

export const getSolvedQuizIds = async (
  db: MySql2Database,
  userId: string
): Promise<string[]> => {
  const solvedQuizIds = await db
    .select({ quizIds: quizLogTable.quizId })
    .from(quizSetLogTable)
    .leftJoin(quizLogTable, eq(quizSetLogTable.id, quizLogTable.quizSetLogId))
    .where(eq(quizSetLogTable.userId, userId));
  const quizIds: string[] = solvedQuizIds
    .map(({ quizIds: quizId }) => quizId)
    .filter((quizId): quizId is string => quizId !== null);
  return quizIds;
};

/**
 * クイズログを作成する関数
 * @param db データベースのインスタンス
 * @param userId ユーザID
 * @param Answer[] 解答データ
 */
export const createQuizLog = async (
  db: MySql2Database,
  userId: string,
  quizModeId: string,
  answers: Answer[]
): Promise<{
  quizSetLog: InsertQuizSetLogType;
  quizLogs: InsertQuizLogType[];
}> => {
  const quizSetLogId = crypto.randomUUID();
  const quizSetLog = {
    id: quizSetLogId,
    userId,
    quizModeId,
  };
  const validatedQuizSetLog = insertQuizSetLogSchema.parse(quizSetLog);

  const quizLogs = answers.map((answer) => {
    const id = crypto.randomUUID();
    return insertQuizLogSchema.parse({
      id,
      quizSetLogId,
      quizId: answer.quizId,
      userAnswer: answer.answer,
      time: answer.answerTime!,
      isCorrect: answer.isCorrect,
    });
  });

  await db.transaction(async (trx) => {
    await trx.insert(quizSetLogTable).values([validatedQuizSetLog]);
    await Promise.all(
      quizLogs.map((quizLog) => trx.insert(quizLogTable).values([quizLog]))
    );
  });

  return {
    quizSetLog,
    quizLogs,
  };
};

/**
 * ユーザのクイズセットログを全て取得する関数
 * @param db データベースのインスタンス
 * @param userId ユーザーID
 * @returns クイズセットログ
 */
export const getQuizSet = async (db: MySql2Database, userId: string) => {
  const quizSetLog = await db
    .select()
    .from(quizSetLogTable)
    .where(eq(quizSetLogTable.userId, userId));

  return quizSetLog;
};

/**
 * クイズセットログIDからクイズログを取得する関数
 * @param db データベースのインスタンス
 * @param id クイズログID
 * @returns クイズログ
 */
export const getQuizLogBySetId = async (
  db: MySql2Database,
  quizSetId: string
) => {
  const quizLogs = await db
    .select()
    .from(quizLogTable)
    .where(eq(quizLogTable.quizSetLogId, quizSetId));
  return quizLogs;
};
