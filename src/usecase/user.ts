import { MySql2Database } from "drizzle-orm/mysql2";
import { User } from "../model/user/user";
import * as UserRepository from "../repository/user";
import { fetchMicroCMSData } from "../core/converter/api/microcms";
import { characters } from "../database/cms/types/response";
import { APIError } from "../core/error";
import { DEFAULT_COSTUME_NAME, MAX_EXPERIENCE } from "../core/constants";

export const createUser = async (
  db: MySql2Database,
  firebaseUid: string,
  nickname: string,
  birthday: string,
): Promise<User> => {
  const uid = crypto.randomUUID();
  const defaultCostume = await fetchMicroCMSData<characters<'get'>[]>('characters', { filters: `name[equals]${DEFAULT_COSTUME_NAME}` });
  if (!defaultCostume || defaultCostume.length === 0) {
    throw new APIError('costume data is not found');
  }
  const user: User = {
    id: uid,
    firebaseUid,
    nickname,
    birthday: new Date(birthday),
    level: 1,
    experience: 0,
    costumeId: defaultCostume.find((c) => c.name === DEFAULT_COSTUME_NAME)!.id,
  }
  return await UserRepository.createUser(db, user);
}

/**
 * FirebaseUidからユーザを取得する
 * @param db データベースのインスタンス
 * @param firebaseUid FirebaseのユーザID
 * @returns User
 */
export const getUserByFirebaseUid = async (
  db: MySql2Database,
  firebaseUid: string,
): Promise<User> => {
  const user = await UserRepository.getUserByFirebaseUid(db, firebaseUid);
  if (!user) {
    throw new Error('user not found');
  }

  return user;
}

/**
 * ユーザの経験値とレベルを更新する
 * @param db データベースのインスタンス
 * @param user ユーザーデータ
 * @param tier 問題の難易度
 * @returns void
 */
export const updateUserExp = async (
  db: MySql2Database,
  user: User,
  tier: number,
): Promise<void> => {
  let newExp = user.experience + tier;

  // レベルアップ判定
  let levelUpCount = 0;
  if (newExp >= MAX_EXPERIENCE) {
    levelUpCount = Math.floor(newExp / MAX_EXPERIENCE);
    newExp = newExp % MAX_EXPERIENCE
  }
  const newLevel = user.level + levelUpCount;
  await UserRepository.updateUserExperience(db, user.id, newExp, newLevel);
  return;
}