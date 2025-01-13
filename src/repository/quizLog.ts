import { MySql2Database } from "drizzle-orm/mysql2";
import { quizLogTable, quizSetLogTable } from "../database/mysql/schema/schema";
import { eq } from "drizzle-orm";
import { Answer } from "../usecase/quizLog";
import { insertQuizSetLogSchema, InsertQuizSetLogType } from "../database/mysql/validators/quizSetLogValidator";
import { insertQuizLogSchema, InsertQuizLogType } from "../database/mysql/validators/quizLogValidator";

export const getSolvedQuizIds = async (
  db: MySql2Database,
  userId: string,
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
}

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
  answers: Answer[],
): Promise<{ quizSetLog: InsertQuizSetLogType, quizLogs: InsertQuizLogType[] }> => {
  const quizSetLogId = crypto.randomUUID();
  const quizSetLog = {
    id: quizSetLogId,
    userId,
    quizModeId,
  }
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
    )
  });

  return {
    quizSetLog,
    quizLogs
  };
}