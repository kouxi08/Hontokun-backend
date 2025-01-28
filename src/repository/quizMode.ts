import { eq } from 'drizzle-orm';
import type { MySql2Database } from 'drizzle-orm/mysql2';
import { quizModeTable } from '../database/mysql/schema/schema.js';

/**
 *
 * @param db データベースのインスタンス
 * @param mode クイズモードの名前
 * @returns quizModeId クイズモードID
 */
export const getQuizModeId = async (
  db: MySql2Database,
  mode: string
): Promise<string> => {
  const data = await db
    .select({ id: quizModeTable.id })
    .from(quizModeTable)
    .where(eq(quizModeTable.name, mode));

  if (data.length === 0 || !data[0]) {
    throw new Error('Quiz mode not found');
  }

  return data[0].id;
};

/**
 * クイズモードIDからクイズモード名を取得する
 * @param db データベースのインスタンス
 * @param id クイズモードID
 * @returns クイズモード名
 */
export const getQuizModeName = async (
  db: MySql2Database,
  id: string
): Promise<string> => {
  const data = await db
    .select({ name: quizModeTable.name })
    .from(quizModeTable)
    .where(eq(quizModeTable.id, id));

  if (data.length === 0 || !data[0]) {
    throw new Error('Quiz mode not found');
  }
  return data[0].name;
};

/**
 * クイズモードをすべて取得する
 * @param db データベースのインスタンス
 * @returns クイズモードIDとクイズモード名のリスト
 */
export const getAllQuizMode = async (db: MySql2Database) => {
  const data = await db
    .select({
      id: quizModeTable.id,
      name: quizModeTable.name,
      description: quizModeTable.description,
    })
    .from(quizModeTable)
    .where(eq(quizModeTable.isPublic, true));
  if (data.length === 0 || !data[0]) {
    throw new Error('Quiz mode not found');
  }

  return data;
};
