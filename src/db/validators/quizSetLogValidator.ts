import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { quizSetLogTable } from '../schema/schema';

export const insertQuizSetLogSchema = createInsertSchema(quizSetLogTable, {
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  quiz_mode_id: z.string().uuid(),
});

export const selectQuizSetLogSchema = createSelectSchema(quizSetLogTable, {
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  quiz_mode_id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
});
