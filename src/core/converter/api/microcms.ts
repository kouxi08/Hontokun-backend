import { createClient } from 'microcms-js-sdk';

const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
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
