type QuizLogParams = {
  id: string;           // クイズログID
  quizId: string;       // クイズID
  quizSetLogId: string; // クイズセットログID
  userAnswer: string;   // ユーザーの回答
  time: number;         // 解答時間（秒数）
  isCorrect: boolean;   // 正誤フラグ
  createdAt: Date;      // 作成日時
  updatedAt: Date;      // 更新日時
};

export class QuizLog {
  private constructor(private params: QuizLogParams) { }

  public static create(params: QuizLogParams): QuizLog {
    return new QuizLog({ ...params });
  }

  public getQuizId(): string {
    return this.params.quizId;
  }

  public isAnswerCorrect(): boolean {
    return this.params.isCorrect;
  }

}
