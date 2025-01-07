import { parseEnv } from 'znv';
import { z } from 'zod';

export const { DATABASE_URL } = parseEnv(process.env, {
  DATABASE_URL: z.string().min(1),
});

export const { GOOGLE_APPLICATION_CREDENTIALS } = parseEnv(process.env, {
  GOOGLE_APPLICATION_CREDENTIALS: z.string().min(1),
});

export const { MICRO_CMS_SERVICE_DOMAIN: MICRO_CMS_SERVICE_DOMAIN } = parseEnv(process.env, {
  MICRO_CMS_SERVICE_DOMAIN: z.string().min(1),
});

export const { MICRO_CMS_API_KEY: MICRO_CMS_API_KEY } = parseEnv(process.env, {
  MICRO_CMS_API_KEY: z.string().min(1),
});