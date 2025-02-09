import type { MySql2Database } from 'drizzle-orm/mysql2';
import { fetchMicroCMSData } from '../core/converter/api/microcms.js';
import type { characters } from '../database/cms/types/response';
import { Costume } from '../model/character/costume.js';
import * as CostumeRepository from '../repository/costume.js';
import { User } from '../model/user/user.js';

/**
 * 着せ替えのデータを取得する関数
 * @param db dbのインスタンス
 * @param userId ユーザーID
 * @returns 着せ替えデータ
 */
export const getCostume = async (
  db: MySql2Database,
  userId: string
): Promise<Costume> => {
  const costumeId = await CostumeRepository.getCostumeId(db, userId);
  const data = await fetchMicroCMSData<characters<'get'>[]>('characters', {
    ids: costumeId,
  });
  if (!data || data.length === 0) {
    throw new Error('costume data is not found');
  }

  const costume = data[0]!;

  return Costume.create({
    ...costume,
    category: costume.category[0],
    image: {
      ...costume.image,
    },
    createdAt: new Date(costume.createdAt),
    updatedAt: new Date(costume.updatedAt),
    publishedAt: new Date(costume.publishedAt),
    revisedAt: new Date(costume.revisedAt),
  });
};

/**
 * コスチュームをすべて取得する（所持・選択フラグを追加）
 * @param db データベースのインスタンス
 * @param user ユーザーデータ
 */
export const getAllCostume = async (db: MySql2Database, user: User) => {
  const costumes = await fetchMicroCMSData<characters<'get'>[]>('characters', {
    filters: 'category[contains]costume',
  });
  const selectedCostumeId = await CostumeRepository.getCostumeId(db, user.id);
  const ownedCostumeIds = await CostumeRepository.getOwnedCostumeIds(
    db,
    user.id
  );

  return costumes.map((costume) => {
    return {
      id: costume.id,
      name: costume.name,
      url: costume.image.url,
      isSelected: selectedCostumeId === costume.id,
      isOwned: ownedCostumeIds.includes(costume.id),
    };
  });
};
