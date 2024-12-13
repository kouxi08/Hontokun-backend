import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { quizChoiceTable, quizTable } from '../schema/schema';
import { z } from 'zod';
import { idRegex } from '../../../core/regex';

const quizFields = {
  id: z.string().regex(idRegex),
  title: z.string().min(1).max(50),
  content: z.string().min(1),
  tier: z.number().int().min(1).max(5),
  imageUrl: z.string().nullable(),
  imageHeight: z.number().int().nullable(),
  imageWidth: z.number().int().nullable(),
  question: z.string().min(1),
  newsUrl: z.string().min(1),
  type: z.enum(['TRUE_OR_FALSE', 'SELECTION']),
  answer: z.string().min(1),
  explanation: z.string().min(1),
  hint: z.string().min(1),
  keyword: z.string().min(1),
  isDeleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  publishedAt: z.date(),
  revisedAt: z.date(),
};

const choiceFields = {
  id: z.number().int(),
  quizId: z.string().regex(idRegex),
  name: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
};

export const insertQuizSchema = createInsertSchema(quizTable, {
  ...quizFields,
});

export const selectQuizSchema = createSelectSchema(quizTable, {
  ...quizFields,
  type: z.string().min(1),
});

export const insertQuizChoiceSchema = createInsertSchema(quizChoiceTable, {
  ...choiceFields,
}).omit({ id: true });

export const selectQuizChoiceSchema = createSelectSchema(quizChoiceTable, {
  ...choiceFields,
});