import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { usersTable } from '../schema/schema';
import { idRegex } from '../../../core/regex';

const userSchema = {
  id: z.string().uuid(),
  firebaseUid: z.string().min(1).max(128),
  nickname: z.string().min(1).max(20),
  birthday: z.date().optional(),
  level: z.number().int().min(1),
  experience: z.number().int().min(0),
  costumeId: z.string().regex(idRegex),
  createdAt: z.date(),
  updatedAt: z.date(),
}

export const insertUserSchema = createInsertSchema(usersTable, { ...userSchema })
  .omit({ createdAt: true, updatedAt: true })
  .required({ firebaseUid: true, nickname: true, level: true, experience: true, costumeId: true });

export const selectUserSchema = createSelectSchema(usersTable, {
  ...userSchema,
});