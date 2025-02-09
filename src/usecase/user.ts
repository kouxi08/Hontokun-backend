import type { MySql2Database } from 'drizzle-orm/mysql2';
import { DEFAULT_COSTUME_NAME, MAX_EXPERIENCE } from '../core/constants.js';
import { fetchMicroCMSData } from '../core/converter/api/microcms.js';
import { APIError } from '../core/error.js';
import type { characters } from '../database/cms/types/response';
import type { User } from '../model/user/user';
import * as UserRepository from '../repository/user.js';
import * as CostumeRepository from '../repository/costume.js';

export const createUser = async (
  db: MySql2Database,
  firebaseUid: string,
  nickname: string,
  birthday: string
): Promise<User> => {
  const uid = crypto.randomUUID();
  const defaultCostume = await fetchMicroCMSData<characters<'get'>[]>(
    'characters',
    { filters: `name[equals]${DEFAULT_COSTUME_NAME}` }
  );
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
  };
  return await UserRepository.createUser(db, user);
};

/**
 * FirebaseUidからユーザを取得する
 * @param db データベースのインスタンス
 * @param firebaseUid FirebaseのユーザID
 * @returns User
 */
export const getUserByFirebaseUid = async (
  db: MySql2Database,
  firebaseUid: string
): Promise<User> => {
  const user = await UserRepository.getUserByFirebaseUid(db, firebaseUid);
  if (!user) {
    throw new Error('user not found');
  }

  return user;
};

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
  tier: number
): Promise<void> => {
  let newExp = user.experience + tier;

  // レベルアップ判定
  let levelUpCount = 0;
  if (newExp >= MAX_EXPERIENCE) {
    levelUpCount = Math.floor(newExp / MAX_EXPERIENCE);
    newExp = newExp % MAX_EXPERIENCE;
  }
  const newLevel = user.level + levelUpCount;
  await UserRepository.updateUserExperience(db, user.id, newExp, newLevel);
  return;
};

/**
 * ユーザを削除する
 * @param db データベースのインスタンス
 * @param userId ユーザID
 * @returns void
 */
export const deleteUser = async (db: MySql2Database, userId: string) => {
  return await UserRepository.deleteUser(db, userId);
};

/**
 * ユーザのデータ・きせかえデータを更新する
 * @param db データベースのインスタンス
 * @param userId ユーザID
 * @param nickname ニックネーム
 * @param birthday 誕生日
 * @param costumeId きせかえID
 * @returns ユーザ・きせかえデータ
 */
export const updateUser = async (
  db: MySql2Database,
  userId: string,
  nickname: string,
  birthday: string,
  costumeId: string | undefined
) => {
  let costume;
  if (costumeId !== undefined) {
    // 持ってるか確認

    // 更新
    costume = await CostumeRepository.updateUserCostume(db, userId, costumeId);
  } else {
    costume = await CostumeRepository.getUserCostume(db, userId);
  }
  const user = await UserRepository.updateUser(db, userId, nickname, birthday);
  if (!user) { throw new Error('failed: update user'); }

  return {
    id: user.id,
    nickname: user.nickname,
    birthday: user.birthday,
    costume: {
      id: costume.id,
      name: costume.name,
      url: costume.image.url
    }
  }
}