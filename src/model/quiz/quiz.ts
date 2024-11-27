import { QuizId } from './quizId';

export class Quiz {
  private constructor(
    private readonly _id: QuizId,
    private _news: {
      title: string;
      content: string;
      image: string;
    },
    private _question: string,
    private _type: 'true_or_false' | 'multiple_choice',
    private _choices: string[] | null,
    private _correctAnswer: string
  ) {}

  get id(): QuizId {
    return this._id;
  }

  get news(): {
    title: string;
    content: string;
    image: string;
  } {
    return this._news;
  }

  get question(): string {
    return this._question;
  }

  get type(): 'true_or_false' | 'multiple_choice' {
    return this._type;
  }

  get choices(): string[] | null {
    return this._choices;
  }

  get correctAnswer(): string {
    return this._correctAnswer;
  }
}
