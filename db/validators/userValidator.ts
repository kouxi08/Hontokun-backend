import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { usersTable } from '../schema/users';

export const insertUserSchema = createInsertSchema(usersTable, {
  firebase_uid: z.string().min(1).max(128),
  nickname: z.string().min(1).max(20),
  birthday: z.date().optional(),
  level: z.number().int().min(1),
  experience: z.number().int().min(0),
  costume_id: z.string().uuid().optional(),
});

export const selectUserSchema = createSelectSchema(usersTable, {
  id: z.string().uuid(),
  firebase_uid: z.string().min(1).max(128),
  nickname: z.string().min(1).max(20),
  birthday: z.date().optional(),
  level: z.number().int().min(1),
  experience: z.number().int().min(0),
  costume_id: z.string().uuid().optional(),
  created_at: z.date(),
  updated_at: z.date(),
});
