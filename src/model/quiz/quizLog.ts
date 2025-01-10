type QuizLog = {
  id: string;           // クイズログID
  quizId: string;       // クイズID
  quizSetLogId: string; // クイズセットログID
  userAnswer: string;   // ユーザーの回答
  time: number;         // 解答時間（秒数）
  isCorrect: boolean;   // 正誤フラグ
  createdAt?: Date;      // 作成日時
  updatedAt?: Date;      // 更新日時
};