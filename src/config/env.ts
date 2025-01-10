import { parseEnv } from 'znv';
import { z } from 'zod';

export const { DATABASE_URL } = parseEnv(process.env, {
  DATABASE_URL: z.string().min(1),
});

export const { MICROCMS_SERVICE_DOMAIN } = parseEnv(process.env, {
  MICROCMS_SERVICE_DOMAIN: z.string().min(1),
});

export const { MICROCMS_API_KEY } = parseEnv(process.env, {
  MICROCMS_API_KEY: z.string().min(1),
});