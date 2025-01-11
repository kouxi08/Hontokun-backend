export type User = {
  id: string;
  firebaseUid: string;
  nickname: string;
  birthday?: Date | null;
  level: number;
  experience: number;
  costumeId: string;
  createdAt?: Date;
  updatedAt?: Date;
}