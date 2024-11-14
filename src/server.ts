import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import type { Context } from 'hono';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { DATABASE_URL } from './env';

export const app = new Hono();

export const db = drizzle(DATABASE_URL);

app.use(logger());

app.get('/healthcheck', (c: Context) => {
  console.info('Healthcheck endpoint is called.');
  return c.json('🌱 Hello Hontokun!', 200);
});
