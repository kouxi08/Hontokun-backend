import { InsertQuizType } from '../../database/mysql/validators/quizValidator';

type QuizParams = {
  id: string;
  title: string;
  content: string;
  tier: number;
  imageUrl: string | null;
  imageHeight: number | null;
  imageWidth: number | null;
  question: string;
  newsUrl: string;
  type: ['TRUE_OR_FALSE' | 'SELECTION'];
  choices: string | null;
  answer: string;
  explanation: string;
  hint: string;
  keyword: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  revisedAt: Date;
};

export class Quiz {
  private readonly choicesArray: string[];

  private constructor(private params: QuizParams) {
    // 改行区切りの文字列を配列に変換
    this.choicesArray =
      typeof params.choices == 'string' ? params.choices.split('\n') : [];
  }

  public static create(params: QuizParams): Quiz {
    return new Quiz(params);
  }

  public get<K extends keyof QuizParams>(key: K): QuizParams[K] {
    return this.params[key];
  }

  public getChoices(): string[] {
    return this.choicesArray;
  }

  public toDatabaseObject(): InsertQuizType {
    return {
      ...this.params,
      type: this.params.type[0],
      news_url: this.params.newsUrl,
      is_deleted: this.params.isDeleted,
      created_at: this.params.createdAt,
      updated_at: this.params.updatedAt,
      published_at: this.params.publishedAt,
      revised_at: this.params.revisedAt,
    };
  }
}
