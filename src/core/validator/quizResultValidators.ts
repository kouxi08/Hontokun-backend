import { z } from 'zod';

// クイズ結果のバリデーションスキーマ
export const quizResultSchema = z.object({
  quizId: z.string().min(1, { message: "quizId is required" }),
  answer: z.string().min(1, { message: "answer is required" }),
  answerTime: z.number().int().nonnegative({ message: "answerTime must be a non-negative integer" }),
});
