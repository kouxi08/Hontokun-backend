import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { quizChoiceTable, quizTable } from '../schema/schema';
import { z } from 'zod';
import { idRegex } from '../../../core/regex';

const quizFields = {
  id: z.string().regex(idRegex),
  title: z.string().min(1).max(50),
  content: z.string().min(1),
  tier: z.number().int().min(1).max(5),
  image_url: z.string().nullable(),
  image_height: z.number().int().nullable(),
  image_width: z.number().int().nullable(),
  question: z.string().min(1),
  news_url: z.string().min(1),
  type: z.enum(['TRUE_OR_FALSE', 'SELECTION']),
  answer: z.string().min(1),
  explanation: z.string().min(1),
  hint: z.string().min(1),
  keyword: z.string().min(1),
  is_deleted: z.boolean().default(false),
  created_at: z.date(),
  updated_at: z.date(),
  published_at: z.date(),
  revised_at: z.date(),
};

const choiceFields = {
  id: z.number().int(),
  quiz_id: z.string().regex(idRegex),
  name: z.string().min(1),
  created_at: z.date(),
  updated_at: z.date(),
};

export const insertQuizSchema = createInsertSchema(quizTable, {
  ...quizFields,
});

export const selectQuizLogSchema = createSelectSchema(quizTable, {
  ...quizFields,
});

export const insertQuizChoiceSchema = createInsertSchema(quizChoiceTable, {
  ...choiceFields,
});

export const selectQuizChoiceSchema = createSelectSchema(quizChoiceTable, {
  ...choiceFields,
});

export type InsertQuizType = z.infer<typeof insertQuizSchema>;
export type SelectQuizLogType = z.infer<typeof selectQuizLogSchema>;
export type InsertQuizChoiceType = z.infer<typeof insertQuizChoiceSchema>;
export type SelectQuizChoiceType = z.infer<typeof selectQuizChoiceSchema>;
