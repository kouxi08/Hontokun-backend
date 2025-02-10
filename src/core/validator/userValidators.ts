import { z } from 'zod';

export const userSchema = z.object({
  nickname: z.string().min(1, { message: 'nickname is required' }),
  birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'birthday must be in the format YYYY-MM-DD })',
  }),
  costumeId: z.string().min(1, { message: 'costumeId is required' }).optional(),
});
