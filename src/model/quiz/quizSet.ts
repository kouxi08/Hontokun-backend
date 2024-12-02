import { Quiz } from './quiz';

export class QuizSet {
  private constructor(
    private readonly _tier: number,
    private readonly _userId: string,
    private readonly _quizModeId: string,
    private readonly _quizzes: Quiz[],
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  get tier(): number {
    return this._tier;
  }

  get userId(): string {
    return this._userId;
  }

  get quizModeId(): string {
    return this._quizModeId;
  }

  get quizzes(): Quiz[] {
    return this._quizzes;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
