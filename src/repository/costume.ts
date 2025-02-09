import { eq } from 'drizzle-orm';
import type { MySql2Database } from 'drizzle-orm/mysql2';
import {
  userCostumesTable,
  usersTable,
} from '../database/mysql/schema/schema.js';

export const getCostumeId = async (
  db: MySql2Database,
  userId: string
): Promise<string> => {
  const costumeId = await db
    .select({ costumeId: usersTable.costumeId })
    .from(usersTable)
    .where(eq(usersTable.id, userId));
  if (!costumeId[0]) {
    throw new Error('costume id is not found');
  }
  return costumeId[0].costumeId!;
};

/**
 * ユーザが所持しているきせかえIDを取得する
 * @param db データベースのインスタンス
 * @param userId ユーザID
 * @returns きせかえIDの配列
 */
export const getOwnedCostumeIds = async (
  db: MySql2Database,
  userId: string
): Promise<string[]> => {
  const costumeIds = await db
    .select({ costumeId: userCostumesTable.costumeId })
    .from(userCostumesTable)
    .where(eq(userCostumesTable.userId, userId));
  return costumeIds.map((costume) => costume.costumeId!);
};
