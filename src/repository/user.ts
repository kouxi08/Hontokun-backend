import { eq } from 'drizzle-orm';
import type { MySql2Database } from 'drizzle-orm/mysql2';
import { AuthError } from '../core/error.js';
import {
  userCostumesTable,
  usersTable,
} from '../database/mysql/schema/schema.js';
import { insertUserSchema } from '../database/mysql/validators/userValidator.js';
import type { User } from '../model/user/user';

export const createUser = async (
  db: MySql2Database,
  user: User
): Promise<User> => {
  const validatedUser = insertUserSchema.parse(user);

  const userExists = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.firebaseUid, validatedUser.firebaseUid))
    .execute();
  if (userExists.length > 0) {
    throw new AuthError('User already exists');
  }

  db.transaction(async (db) => {
    await db.insert(usersTable).values(validatedUser);
    await db.insert(userCostumesTable).values({
      userId: validatedUser.id,
      costumeId: validatedUser.costumeId,
    });
  });

  return validatedUser;
};

/**
 * FirebaseUidからユーザデータを取得する
 * @param db データベースのインスタンス
 * @param firebaseUid FirebaseのID
 * @returns ユーザデータ
 */
export const getUserByFirebaseUid = async (
  db: MySql2Database,
  firebaseUid: string
): Promise<User | null> => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.firebaseUid, firebaseUid));

  return user ?? null;
};

/**
 * 経験値とレベルを更新する
 * @param db データベースのインスタンス
 * @param userId ユーザID
 * @param experience 経験値
 * @param level レベル
 * @returns void
 */
export const updateUserExperience = async (
  db: MySql2Database,
  userId: string,
  experience: number,
  level: number
): Promise<void> => {
  await db
    .update(usersTable)
    .set({ experience, level })
    .where(eq(usersTable.id, userId));
  return;
};
