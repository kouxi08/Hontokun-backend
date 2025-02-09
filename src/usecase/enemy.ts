import type { MySql2Database } from 'drizzle-orm/mysql2';
import { fetchMicroCMSData } from '../core/converter/api/microcms.js';
import type { characters } from '../database/cms/types/response';

/**
 * クイズの敵のキャクターデータを取得する関数
 * @param db dbのインスタンス
 * @param tier 難易度
 * @returns 指名手配猫のデータ
 */
export const getQuizEnemy = async (
  db: MySql2Database,
  tier: number
) => {
  const data = await fetchMicroCMSData<characters<'get'>[]>('characters', {
    filters: `tier[equals]${tier}`,
  });
  if (!data || data.length === 0) {
    throw new Error('enemy data is not found');
  }

  const enemy = data[0]!;
  return {
    id: enemy.id,
    name: enemy.name,
    url: enemy.image.url,
  }
};
