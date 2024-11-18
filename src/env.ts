import { parseEnv } from 'znv';
import { z } from 'zod';

export const { DATABASE_URL } = parseEnv(process.env, {
  DATABASE_URL: z.string().min(1),
});

export const { GOOGLE_APPLICATION_CREDENTIALS } = parseEnv(process.env, {
  GOOGLE_APPLICATION_CREDENTIALS: z.string().min(1),
});
