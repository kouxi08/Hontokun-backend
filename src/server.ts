import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import type { Context } from 'hono';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { DATABASE_URL } from './config/env';
import { firebaseApp } from './config/firebase';
import { createAuthMiddleware } from './middleware/auth';
import { corsMiddleware } from './middleware/cors';
import * as QuizUsecase from './usecase/quiz';
import { prettyJSON } from 'hono/pretty-json';

export const app = new Hono();
export const db = drizzle(DATABASE_URL);
const authMiddleware = createAuthMiddleware(firebaseApp);

app.use(logger());
app.use(prettyJSON());
app.use('/webhook/quiz', corsMiddleware());
app.use('/sign-up', authMiddleware);

app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ error: err.message }, 500);
});

app.get('/health-check', (c: Context) => {
  console.info('Health-check endpoint is called.');
  return c.json('🌱 Hello Hontokun!', 200);
});

app.post('/webhook/quiz', async (c: Context) => {
  const req = await c.req.json();
  if (!req) {
    throw new Error('Invalid request body');
  }

  const quizData = req['contents']['new']['publishValue'];

  if (req['type'] === 'new') {
    await QuizUsecase.createQuiz(db, quizData);
  } else if (req['type'] === 'edit') {
    await QuizUsecase.updateQuiz(db, quizData);
  } else {
    throw new Error('Invalid request type');
  }

  return c.json({ message: 'Success' }, 200);
});
