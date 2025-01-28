import { eq } from 'drizzle-orm';
import type { MySql2Database } from 'drizzle-orm/mysql2';
import { usersTable } from '../database/mysql/schema/schema.js';

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
