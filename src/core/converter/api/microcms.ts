import { createClient } from 'microcms-js-sdk';
import { MICRO_CMS_API_KEY, MICRO_CMS_SERVICE_DOMAIN } from '../../../config/env';

const client = createClient({
  serviceDomain: MICRO_CMS_SERVICE_DOMAIN,
  apiKey: MICRO_CMS_API_KEY
});

/**
 * microCMSからデータを取得する汎用関数
 * @param endpoint - 取得するエンドポイント名
 * @param queries - クエリパラメータ (オプション)
 * @returns フェッチしたデータ
 */
export const fetchMicroCMSData = async<T>(
  endpoint: string,
  queries?: Record<string, unknown>
): Promise<T> => {
  try {
    const data = await client.get({ endpoint, queries });
    console.log(`Data fetched from ${endpoint}:`, data['contents']);
    return data.contents;
  } catch (error) {
    console.error('Error fetching data from microCMS:', error);
    throw error;
  }
};
