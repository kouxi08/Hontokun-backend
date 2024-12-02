import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import type { Context } from 'hono';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { DATABASE_URL } from './config/env';
import { firebaseApp } from './config/firebase';
import { createAuthMiddleware } from './middleware/auth';
import { paths } from './openapi/schema';
import { QuizSet } from './model/quiz/quizSet';
import * as QuizUsecase from './usecase/quiz';

export const app = new Hono();
export const db = drizzle(DATABASE_URL);
const authMiddleware = createAuthMiddleware(firebaseApp);

app.use(logger());
app.use('/sign-up', authMiddleware);
app.use('/quiz/:tier', authMiddleware);

app.get('/health-check', (c: Context) => {
  console.info('Health-check endpoint is called.');
  return c.json('🌱 Hello Hontokun!', 200);
});

app.get('/quiz/:tier', async (c: Context) => {
  const tier: paths['/quiz/{tier}']['get']['parameters']['path']['tier'] =
    Number(c.req.param('tier'));
  const userId = c.get('firebaseUId');

  const quizSet: QuizSet = await QuizUsecase.getQuizSetByTier(db, userId, tier);

  // TODO: クイズセットをクイズセットログテーブルに保存
});
