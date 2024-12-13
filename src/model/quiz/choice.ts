type ChoiceParams = {
  id: number | null;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export class Choice {
  private constructor(private params: ChoiceParams) { }

  public static create(params: ChoiceParams): Choice {
    return new Choice(params);
  }

  get id(): number | null {
    return this.params.id;
  }

  get name(): string {
    return this.params.name;
  }

  get createdAt(): Date {
    return this.params.createdAt;
  }

  get updatedAt(): Date {
    return this.params.updatedAt;
  }

  public toJSON(): ChoiceParams {
    return {
      id: this.params.id,
      name: this.params.name,
      createdAt: this.params.createdAt,
      updatedAt: this.params.updatedAt,
    };
  }
}
