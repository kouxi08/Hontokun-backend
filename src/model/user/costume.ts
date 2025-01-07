type CostumeParams = {
  id: string;
  category: string;
  name: string;
  image: {
    url: string;
    height: number;
    width: number;
  };
  lines: string;
  tier: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  revisedAt: Date;
}

export class Costume {
  private constructor(private params: CostumeParams) { }

  public static create(params: CostumeParams): Costume {
    return new Costume(params);
  }

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

  get lines(): string {
    return this.params.lines;
  }

  get tier(): number {
    return this.params.tier;
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

  public toJSON(): CostumeParams {
    return { ...this.params };
  }

}