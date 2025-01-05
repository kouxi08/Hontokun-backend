export class User {
  private constructor(
    private readonly _id: string,
    private readonly _firebaseUid: string,
    private _nickname: string,
    private _birthday: Date,
    private _level: number,
    private _experience: number,
    private _costumeId: number,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  get id(): string {
    return this._id;
  }
}
