import { createClient } from 'microcms-js-sdk';
import {
  MICROCMS_API_KEY,
  MICROCMS_SERVICE_DOMAIN,
} from '../../../config/env.js';

const client = createClient({
  serviceDomain: MICROCMS_SERVICE_DOMAIN,
  apiKey: MICROCMS_API_KEY,
});

/**
 * microCMSからデータを取得する汎用関数
 * @param endpoint - 取得するエンドポイント名
 * @param queries - クエリパラメータ (オプション)
 * @returns フェッチしたデータ
 */
export const fetchMicroCMSData = async <T>(
  endpoint: string,
  queries?: Record<string, unknown>
): Promise<T> => {
  try {
    const data = await client.get({ endpoint, queries });
    return data.contents;
  } catch (error) {
    console.error('Error fetching data from microCMS:', error);
    throw error;
  }
};
