import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { quizLogTable } from '../schema/schema';

export const insertQuizLogSchema = createInsertSchema(quizLogTable, {
  id: z.string().uuid(),
  quiz_id: z.string().uuid(),
  quiz_set_log_id: z.string().uuid(),
  user_answer: z.string(),
  is_correct: z.boolean(),
  time: z.number().int().min(0),
});

export const selectQuizLogSchema = createSelectSchema(quizLogTable, {
  id: z.string().uuid(),
  quiz_id: z.string().uuid(),
  quiz_set_log_id: z.string().uuid(),
  user_answer: z.string(),
  is_correct: z.boolean(),
  time: z.number().int().min(0),
  created_at: z.date(),
  updated_at: z.date(),
});
