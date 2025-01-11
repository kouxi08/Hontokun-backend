import { MySql2Database } from "drizzle-orm/mysql2";
import { quizModeTable } from "../database/mysql/schema/schema";
import { eq } from "drizzle-orm";

/**
 * 
 * @param db データベースのインスタンス
 * @param mode クイズモードの名前
 * @returns quizModeId クイズモードID
 */
export const getQuizModeId = async (
  db: MySql2Database,
  mode: string,
): Promise<string> => {
  const data = await db
    .select({ id: quizModeTable.id })
    .from(quizModeTable)
    .where(eq(quizModeTable.name, mode));

  if (data.length === 0 || !data[0]) {
    throw new Error('Quiz mode not found');
  }

  return data[0].id;
}