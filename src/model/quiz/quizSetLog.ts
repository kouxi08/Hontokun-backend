type QuizSetLog = {
  id: string; // クイズセットログID
  userId: string; // ユーザーID
  quizModeId: number; // クイズモードID
  createdAt?: Date; // 作成日時
  updatedAt?: Date; // 更新日時
};
