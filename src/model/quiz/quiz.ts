import { Choice } from './choice';

export type QuizParams = {
  id: string;
  title: string;
  content: string;
  tier: number;
  imageUrl: string | null;
  imageHeight: number | null;
  imageWidth: number | null;
  question: string;
  newsUrl: string;
  type: 'TRUE_OR_FALSE' | 'SELECTION';
  choices: Choice[];
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
  private constructor(private params: QuizParams) { }

  public static create(params: QuizParams): Quiz {
    return new Quiz({
      ...params,
      choices: params.choices.map((choice) => Choice.create(choice)),
    });
  }

  get id(): string {
    return this.params.id;
  }

  get title(): string {
    return this.params.title;
  }

  get content(): string {
    return this.params.content;
  }

  get tier(): number {
    return this.params.tier;
  }

  get imageUrl(): string | null {
    return this.params.imageUrl;
  }

  get imageHeight(): number | null {
    return this.params.imageHeight;
  }

  get imageWidth(): number | null {
    return this.params.imageWidth;
  }

  get question(): string {
    return this.params.question;
  }

  get newsUrl(): string {
    return this.params.newsUrl;
  }

  get type(): 'TRUE_OR_FALSE' | 'SELECTION' {
    return this.params.type;
  }

  get choices(): Choice[] {
    return this.params.choices;
  }

  get answer(): string {
    return this.params.answer;
  }

  get explanation(): string {
    return this.params.explanation;
  }

  get hint(): string {
    return this.params.hint;
  }

  get keyword(): string {
    return this.params.keyword;
  }

  get isDeleted(): boolean {
    return this.params.isDeleted;
  }

  get createdAt(): Date {
    return this.params.createdAt;
  }

  get updatedAt(): Date {
    return this.params.updatedAt;
  }

  get publishedAt(): Date {
    return this.params.publishedAt;
  }

  get revisedAt(): Date {
    return this.params.revisedAt;
  }

  public toJSON(): QuizParams {
    return this.params;
  }
}

