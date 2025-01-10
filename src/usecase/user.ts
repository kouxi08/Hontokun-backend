import { MySql2Database } from "drizzle-orm/mysql2";
import { User } from "../model/user/user";
import * as UserRepository from "../repository/user";

export const createUser = async (
  db: MySql2Database,
  firebaseUid: string,
  nickname: string,
  birthday: string,
): Promise<User> => {
  const uid = crypto.randomUUID();
  const user: User = {
    id: uid,
    firebaseUid,
    nickname,
    birthday: new Date(birthday),
    level: 1,
    experience: 0,
    costumeId: 'uaa4ulkf65hj989lftimm02bgt68umhre_9f',  // TODO:デフォルト定義
  }
  return await UserRepository.createUser(db, user);
}