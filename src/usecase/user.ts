import { MySql2Database } from "drizzle-orm/mysql2";
import { User } from "../model/user/user";
import * as UserRepository from "../repository/user";
import { fetchMicroCMSData } from "../core/converter/api/microcms";
import { characters } from "../database/cms/types/response";
import { APIError } from "../core/error";
import { defaultCostumeName } from "../core/constants";

export const createUser = async (
  db: MySql2Database,
  firebaseUid: string,
  nickname: string,
  birthday: string,
): Promise<User> => {
  const uid = crypto.randomUUID();
  const defaultCostume = await fetchMicroCMSData<characters<'get'>[]>('characters', { filters: `name[equals]${defaultCostumeName}` });
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
    costumeId: defaultCostume.find((c) => c.name === defaultCostumeName)!.id,
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