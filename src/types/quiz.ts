import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type {
  quizChoiceTable,
  quizTable,
} from '../database/mysql/schema/schema';

export type SelectQuizType = InferSelectModel<typeof quizTable>;
export type SelectChoiceType = InferSelectModel<typeof quizChoiceTable>;
export type SelectQuizWithChoices = {
  quiz: SelectQuizType;
  choice: SelectChoiceType | null;
};

export type InsertQuizType = InferInsertModel<typeof quizTable>;
export type InsertChoiceType = InferInsertModel<typeof quizChoiceTable>;
