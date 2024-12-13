import { MySqlRawQueryResult } from 'drizzle-orm/mysql2';
import { Quiz } from './quiz';

type QuizSetParams = {
  tier: number;
  userId: string;
  quizModeId: string;
  quizzes: Quiz[];
  createdAt: Date;
  updatedAt: Date;
}

export class QuizSet {
  private constructor(private params: QuizSetParams) { }

  public static create(params: QuizSetParams): QuizSet {
    return new QuizSet(params);
  }

  public get<K extends keyof QuizSetParams>(key: K): QuizSetParams[K] {
    return this.params[key];
  }
}

