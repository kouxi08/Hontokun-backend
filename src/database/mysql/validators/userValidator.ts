import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { usersTable } from '../schema/schema';

export const insertUserSchema = createInsertSchema(usersTable, {
  firebaseUid: z.string().min(1).max(128),
  nickname: z.string().min(1).max(20),
  birthday: z.date().optional(),
  level: z.number().int().min(1),
  experience: z.number().int().min(0),
  costumeId: z.string().uuid().optional(),
});

export const selectUserSchema = createSelectSchema(usersTable, {
  id: z.string().uuid(),
  firebaseUid: z.string().min(1).max(128),
  nickname: z.string().min(1).max(20),
  birthday: z.date().optional(),
  level: z.number().int().min(1),
  experience: z.number().int().min(0),
  costumeId: z.string().uuid().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
