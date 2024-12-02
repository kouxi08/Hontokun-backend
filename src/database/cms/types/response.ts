type Reference<T, R> = T extends 'get' ? R : string | null;
interface GetsType<T> {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}
type DateType = {
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
};
type Structure<T, P> = T extends 'get'
  ? { id: string } & DateType & Required<P>
  : T extends 'gets'
  ? GetsType<{ id: string } & DateType & Required<P>>
  : Partial<DateType> & (T extends 'patch' ? Partial<P> : P);

export type quiz<T='get'> = Structure<
T,
{
  /**
   * タイトル
   */
  title: string
  /**
   * 本文
   */
  content: string
  /**
   * 難易度
   */
  tier: number
  /**
   * 画像
   */
  image?: { url: string, width: number, height: number }
  /**
   * 質問文
   */
  question: string
  /**
   * 元ニュースURL
   */
  newsUrl?: string
  /**
   * 選択肢
   */
  choices?: string
  /**
   * 出題タイプ
   */
  type: ['TRUE_OR_FALSE' | 'SELECTION']
  /**
   * 解答
   */
  answer: string
  /**
   * 解説
   */
  explanation: string
  /**
   * ヒント
   */
  hint: string
  /**
   * 削除フラグ
   */
  isDeleted: boolean
}>

export type characters<T='get'> = Structure<
T,
{
  /**
   * カテゴリ
   */
  category?: ['指名手配' | '着せ替え']
  /**
   * 画像
   */
  images?: { url: string, width: number, height: number }
  /**
   * セリフ
   */
  lines?: string
  /**
   * 名前
   */
  name?: string
}>


export interface EndPoints {
  get: {
    'quiz': quiz<'get'>
    'characters': characters<'get'>
  }
  gets: {
    'quiz': quiz<'gets'>
    'characters': characters<'gets'>
  }
  post: {
    'quiz': quiz<'post'>
    'characters': characters<'post'>
  }
  put: {
    'quiz': quiz<'put'>
    'characters': characters<'put'>
  }
  patch: {
    'quiz': quiz<'patch'>
    'characters': characters<'patch'>
  }
}
