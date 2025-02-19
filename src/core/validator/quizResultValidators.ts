import { z } from 'zod';

// クイズ結果のバリデーションスキーマ
export const quizResultSchema = z.object({
  quizMode: z.number(),
  answers: z.array(
    z.object({
      quizId: z.string().min(1, { message: 'quizId is required' }),
      order: z.number().int().nonnegative({ message: 'order is required' }),
      answer: z.union([
        z.boolean(),
        z.string().min(1, { message: 'answer is required' }),
      ]),
      answerTime: z
        .number()
        .int()
        .nonnegative({ message: 'answerTime must be a non-negative integer' })
        .optional(),
    })
  ),
});
