import { Character, CharacterParams } from "./character";

type EnemyParams = CharacterParams & {
  tier: number;
};

export class Enemy extends Character {
  private constructor(private enemyParams: EnemyParams) {
    super(enemyParams);
  }

  public static create(params: EnemyParams): Enemy {
    return new Enemy(params);
  }

  get tier(): number {
    return this.enemyParams.tier;
  }

  public toJSON(): EnemyParams {
    return { ...this.enemyParams };
  }
}
