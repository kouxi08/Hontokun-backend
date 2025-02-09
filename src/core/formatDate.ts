/**
 * Date型からyyyy-mm-dd hh:mm:ss形式の文字列に変換する
 * @param date 日付
 * @returns yyyy-mm–dd hh:mm:ss形式の文字列
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月は0始まりなので+1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * Date型から時間経過を分かりやすい形式に変換する
 * @param date 日付
 * @returns 時間経過の文字列（例: "5秒前", "2分前", "3日前" など）
 */
export const formatTimeAgo = (date: Date): string | null => {
  const units = [
    { label: '秒前', value: 60 },
    { label: '分前', value: 60 },
    { label: '時間前', value: 24 },
    { label: '日前', value: 30 },
    { label: 'ヶ月前', value: 12 },
    { label: '年前', value: Number.MAX_SAFE_INTEGER }, // 年の単位は無制限に設定
  ];

  let diff = Math.floor((new Date().getTime() - date.getTime()) / 1000); // 秒単位の差
  if (diff === 0) {
    return 'たった今';
  }
  for (const unit of units) {
    if (diff < unit.value) {
      return `${diff}${unit.label}`;
    }
    diff = Math.floor(diff / unit.value);
  }

  return null;
};
