import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { quizModeTable } from '../schema/schema';

export const insertQuizModeSchema = createInsertSchema(quizModeTable, {
  id: z.string().uuid(),
  name: z.string().min(1).max(20),
  description: z.string().min(1).max(100),
  is_public: z.boolean(),
});

export const selectQuizModeSchema = createSelectSchema(quizModeTable, {
  id: z.string().uuid(),
  name: z.string().min(1).max(20),
  description: z.string().min(1).max(100),
  is_public: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
});
