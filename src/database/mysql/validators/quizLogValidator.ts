import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { quizLogTable } from '../schema/schema';
import { idRegex } from '../../../core/regex';

const quizLogSchema = {
  id: z.string().uuid(),
  quizId: z.string().regex(idRegex),
  quizSetLogId: z.string().uuid(),
  userAnswer: z.string(),
  isCorrect: z.boolean(),
  time: z.number().int().min(0).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
}

export const insertQuizLogSchema = createInsertSchema(quizLogTable, {
  ...quizLogSchema
}).omit({ createdAt: true, updatedAt: true });

export const selectQuizLogSchema = createSelectSchema(quizLogTable, {
  ...quizLogSchema
});

export type InsertQuizLogType = z.infer<typeof insertQuizLogSchema>;
export type SelectQuizLogType = z.infer<typeof selectQuizLogSchema>;