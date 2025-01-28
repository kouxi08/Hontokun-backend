import type { CharacterParams } from './character';
import { Character } from './character.js';

type CostumeParams = CharacterParams & {
  lines: string;
};

export class Costume extends Character {
  private constructor(private costumeParams: CostumeParams) {
    super(costumeParams);
  }

  public static create(params: CostumeParams): Costume {
    return new Costume(params);
  }

  get lines(): string {
    return this.costumeParams.lines;
  }

  public toJSON(): CostumeParams {
    return { ...this.costumeParams };
  }
}
