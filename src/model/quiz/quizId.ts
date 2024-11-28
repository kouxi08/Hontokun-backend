export class QuizId {
  private constructor(private readonly _value: string) {
    if (!QuizId.isValid(_value)) {
      throw new Error(
        'Invalid UUID format. It must be a 36-character hexadecimal string.'
      );
    }
    this._value = _value;
  }

  private static isValid(value: string): boolean {
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: QuizId): boolean {
    return this.value === other.value;
  }
}
