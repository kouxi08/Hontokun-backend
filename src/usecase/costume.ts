import { MySql2Database } from "drizzle-orm/mysql2";
import * as CostumeRepository from "../repository/costume";
import { fetchMicroCMSData } from "../core/converter/api/microcms";
import { Costume } from "../model/user/costume";
import { characters } from "../database/cms/types/response";

/**
 * 着せ替えのデータを取得する関数
 * @param db dbのインスタンス
 * @param userId ユーザーID
 * @returns 着せ替えデータ
 */
export const getCostume = async (db: MySql2Database, userId: string): Promise<Costume> => {
  const costumeId = await CostumeRepository.getCostumeId(db, userId);
  const costume = await fetchMicroCMSData<characters<'get'>>('characters', { ids: costumeId });

  return Costume.create({
    ...costume,
    category: costume.category[0],
    images: {
      url: costume.images.url,
      height: costume.images.height,
      width: costume.images.width,
    },
    createdAt: new Date(costume.createdAt),
    updatedAt: new Date(costume.updatedAt),
    publishedAt: new Date(costume.publishedAt),
    revisedAt: new Date(costume.revisedAt),
  });
}