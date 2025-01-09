export type CharacterParams = {
  id: string;
  category: string;
  name: string;
  image: {
    url: string;
    height: number;
    width: number;
  };
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  revisedAt: Date;
};

export abstract class Character {
  protected constructor(protected params: CharacterParams) { }

  get id(): string {
    return this.params.id;
  }

  get category(): string {
    return this.params.category;
  }

  get name(): string {
    return this.params.name;
  }

  get image(): {
    url: string;
    height: number;
    width: number;
  } {
    return this.params.image;
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

  public toJSON(): CharacterParams {
    return { ...this.params };
  }
}
