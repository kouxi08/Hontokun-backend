import { MySql2Database } from "drizzle-orm/mysql2";
import { Enemy } from "../model/character/enemy";
import { fetchMicroCMSData } from "../core/converter/api/microcms";
import { characters } from "../database/cms/types/response";


/**
 * クイズの敵のキャクターデータを取得する関数
 * @param db dbのインスタンス
 * @param tier 難易度
 * @returns 指名手配猫のデータ
 */
export const getQuizEnemy = async (db: MySql2Database, tier: number): Promise<Enemy> => {
  const data = await fetchMicroCMSData<characters<'get'>[]>('characters', { filters: `tier[equals]${tier}` });
  console.log(data);
  if (!data || data.length === 0) {
    throw new Error('enemy data is not found');
  }

  const enemy = data[0]!;
  return Enemy.create({
    ...enemy,
    category: enemy.category[0],
    image: {
      ...enemy.image,
    },
    createdAt: new Date(enemy.createdAt),
    updatedAt: new Date(enemy.updatedAt),
    publishedAt: new Date(enemy.publishedAt),
    revisedAt: new Date(enemy.revisedAt)
  });

}