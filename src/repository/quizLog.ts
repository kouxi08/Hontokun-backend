import { MySql2Database } from "drizzle-orm/mysql2";
import { quizLogTable, quizSetLogTable } from "../database/mysql/schema/schema";
import { eq } from "drizzle-orm";

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