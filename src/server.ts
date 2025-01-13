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
import { ZodError } from 'zod';
import { Quiz } from './model/quiz/quiz';
import { convertQuizToAPI } from './core/converter/api/quiz';
import { quiz } from './database/cms/types/response';
import * as CostumeUsecase from './usecase/costume';
import * as EnemyUsecase from './usecase/enemy';
import { paths } from './openapi/schema';
import { quizModeSchema, quizResultSchema } from './core/validator/quizResultValidators';
import * as QuizLogUsecase from './usecase/quizLog';
import * as UserUsecase from './usecase/user';
import { createUserSchema } from './core/validator/createUserValidator';
import { AuthError } from './core/error';

export const app = new Hono();
export const db = drizzle({ connection: DATABASE_URL, casing: 'snake_case' });

const authMiddleware = createAuthMiddleware(firebaseApp);

app.use(logger());
app.use(prettyJSON());
app.use('/webhook/quiz', corsMiddleware());
app.use('/sign-up', authMiddleware);
app.use('/quiz/result', authMiddleware);
// app.use('/quiz/:tier', authMiddleware);

app.onError((error, c) => {
  console.error(error);
  const errorResponse = (status: number, message: string) => {
    return c.json({ error: { name: error.name, message: error.message } }, { status });
  }
  if (error instanceof AuthError) return errorResponse(401, error.message);
  if (error instanceof ZodError) return errorResponse(500, error.message);

  return errorResponse(500, 'Something unexpected happened');
});

app.get('/health-check', (c: Context) => {
  console.info('Health-check endpoint is called.');
  return c.json('🌱 Hello Hontokun!', 200);
});

app.post('sign-up', async (c: Context) => {
  const userId = c.get('firebaseUid');
  const body: paths['/sign-up']['post']['requestBody']['content']['application/json'] = await c.req.json();
  const { nickname, birthday } = createUserSchema.parse(body);
  const user = await UserUsecase.createUser(db, userId, nickname, birthday);

  return c.json(user, 200);
})

app.post('/quiz/result', async (c: Context) => {
  const firebaseUid = c.get('firebaseUid');
  const user = await UserUsecase.getUserByFirebaseUid(db, firebaseUid);
  const body: paths['/quiz/result']['post']['requestBody']['content']['application/json'] = await c.req.json();
  const quizMode = quizModeSchema.parse(body.quizMode);
  const answers = body.answers!.map((data) => quizResultSchema.parse(data));
  const quizData = answers.map((data) => {
    const { quizId, answer, answerTime } = data;
    return { quizId, answer, answerTime };
  })
  const { quizSetId, accuracy, quizList } = await QuizLogUsecase.createQuizLog(db, user, quizMode, quizData);
  const costume = await CostumeUsecase.getCostume(db, user.id);

  // TODO: 指名手配猫画像返却

  return c.json({
    quizSetId,
    accuracy,
    quizList,
    costume: {
      id: costume.id,
      name: costume.name,
      url: costume.image.url,
    },
  }, 200);
});

app.get('/quiz/:tier', async (c: Context) => {
  const tier = Number(c.req.param('tier'));
  const userId = c.get('firebaseUid');

  // 着せ替え取得
  const costume = await CostumeUsecase.getCostume(db, userId);
  // 指名手配猫画像取得
  const enemy = await EnemyUsecase.getQuizEnemy(db, tier);

  // クイズ取得
  const quizzes: Quiz[] = await QuizUsecase.getQuizzes(db, userId, tier);
  const quizList = quizzes.map((quiz) => convertQuizToAPI(quiz));

  const response: paths['/quiz/{tier}']['get']['responses']['200']['content']['application/json'] = {
    enemy: {
      id: enemy.id,
      name: enemy.name,
      url: enemy.image.url,
    },
    costume: {
      id: costume.id,
      name: costume.name,
      url: costume.image.url,
    },
    quizList,
  }

  return c.json(response, 200);
});

app.post('/webhook/quiz', async (c: Context) => {
  const req = await c.req.json();
  if (!req) {
    throw new Error('Invalid request body');
  }

  const quizData: quiz<'get'> = req['contents']['new']['publishValue'];

  if (req['type'] === 'new') {
    await QuizUsecase.createQuiz(db, quizData);
  } else if (req['type'] === 'edit') {
    await QuizUsecase.updateQuiz(db, quizData);
  } else {
    throw new Error('Invalid request type');
  }

  return c.json({ message: 'Success' }, 200);
});
