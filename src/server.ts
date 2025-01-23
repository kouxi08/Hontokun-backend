import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import type { Context } from 'hono';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { z, ZodError } from 'zod';
import { DATABASE_URL } from './config/env.js';
import { firebaseApp } from './config/firebase.js';
import { convertQuizToAPI } from './core/converter/api/quiz.js';
import { AuthError } from './core/error.js';
import { createUserSchema } from './core/validator/createUserValidator.js';
import {
  quizModeSchema,
  quizResultSchema,
} from './core/validator/quizResultValidators.js';
import type { quiz } from './database/cms/types/response';
import { createAuthMiddleware } from './middleware/auth.js';
import { corsMiddleware } from './middleware/cors.js';
import type { Quiz } from './model/quiz/quiz';
import type { paths } from './openapi/schema';
import * as CostumeUsecase from './usecase/costume.js';
import * as QuizUsecase from './usecase/quiz.js';
import * as EnemyUsecase from './usecase/enemy.js';
import * as QuizLogUsecase from './usecase/quizLog.js';
import * as UserUsecase from './usecase/user.js';
import type { History } from './types/api/history';
import { zValidator } from '@hono/zod-validator';
import { Variables } from './core/variables.js';
import { formatDate } from './core/formatDate.js';

export const app = new Hono<{ Variables: Variables }>();
export const db = drizzle({ connection: DATABASE_URL, casing: 'snake_case' });

const authMiddleware = createAuthMiddleware(firebaseApp);

app.use(logger());
app.use(prettyJSON());
app.use('/webhook/quiz', corsMiddleware());
app.use('/sign-up', authMiddleware);
app.use('/main', authMiddleware);
app.use('/quiz/result', authMiddleware);
app.use('/history', authMiddleware);
app.use('/quiz/:tier', authMiddleware);
app.use('/history/quiz-set/:quizSetId', authMiddleware);

app.onError((error, c) => {
  console.error(error);
  const errorResponse = (status: number, message: string) => {
    return c.json(
      { error: { name: error.name, message: error.message } },
      { status }
    );
  };
  if (error instanceof AuthError) {
    return errorResponse(401, error.message);
  }
  if (error instanceof ZodError) {
    return errorResponse(500, error.message);
  }

  return errorResponse(500, 'Something unexpected happened');
});

app.get('/health-check', (c: Context) => {
  console.info('Health-check endpoint is called.');
  return c.json('🌱 Hello Hontokun!', 200);
});

app.post('sign-up', async (c: Context) => {
  const userId = c.get('firebaseUid');
  const body: paths['/sign-up']['post']['requestBody']['content']['application/json'] =
    await c.req.json();
  const { nickname, birthday } = createUserSchema.parse(body);
  const user = await UserUsecase.createUser(db, userId, nickname, birthday);

  return c.json(user, 200);
});

app.get('/main', async (c: Context) => {
  const firebaseUid = c.get('firebaseUid');
  const user = await UserUsecase.getUserByFirebaseUid(db, firebaseUid);
  const costume = await CostumeUsecase.getCostume(db, user.id);

  return c.json({
    user: {
      id: user.id,
      nickname: user.nickname,
      birthday: user.birthday,
      level: user.level,
      experience: user.experience,
    },
    costume: {
      id: costume.id,
      name: costume.name,
      url: costume.image.url,
      dialogue: costume.lines,
    },
  });
});

app.post('/quiz/result', async (c: Context) => {
  const firebaseUid = c.get('firebaseUid');
  const user = await UserUsecase.getUserByFirebaseUid(db, firebaseUid);
  const body: paths['/quiz/result']['post']['requestBody']['content']['application/json'] =
    await c.req.json();
  const quizMode = quizModeSchema.parse(body.quizMode);
  const answers = body.answers!.map((data) => quizResultSchema.parse(data));
  const quizData = answers.map((data) => {
    const { quizId, answer, answerTime } = data;
    return { quizId, answer, answerTime };
  });
  const { quizSetId, accuracy, quizList } = await QuizLogUsecase.createQuizLog(
    db,
    user,
    quizMode,
    quizData
  );
  const costume = await CostumeUsecase.getCostume(db, user.id);

  // TODO: 指名手配猫画像返却
  const enemy = quizList[0]
    ? await EnemyUsecase.getQuizEnemy(db, quizList[0].tier)
    : null;

  return c.json(
    {
      quizSetId,
      accuracy,
      quizList,
      costume: {
        id: costume.id,
        name: costume.name,
        url: costume.image.url,
      },
      enemy: enemy
        ? {
            id: enemy.id,
            name: enemy.name,
            url: enemy.image.url,
          }
        : null,
    },
    200
  );
});

app.get('/quiz/:tier', async (c: Context) => {
  const tier = Number(c.req.param('tier'));
  const firebaseUid = c.get('firebaseUid');
  const user = await UserUsecase.getUserByFirebaseUid(db, firebaseUid);

  // 着せ替え取得
  const costume = await CostumeUsecase.getCostume(db, user.id);
  // 指名手配猫画像取得
  const enemy = await EnemyUsecase.getQuizEnemy(db, tier);

  // クイズ取得
  const quizzes: Quiz[] = await QuizUsecase.getQuizzes(db, user.id, tier);
  const quizList = quizzes.map((quiz) => convertQuizToAPI(quiz));

  const response: paths['/quiz/{tier}']['get']['responses']['200']['content']['application/json'] =
    {
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
    };

  return c.json(response, 200);
});

app.get('/history', async (c: Context) => {
  const firebaseUid = c.get('firebaseUid');
  const user = await UserUsecase.getUserByFirebaseUid(db, firebaseUid);
  const costume = await CostumeUsecase.getCostume(db, user.id);

  const history: History = {};
  const logs = await QuizLogUsecase.getAllQuizLog(db, user.id);
  let totalAccuracy = 0;
  history.tierList = await Promise.all(
    logs.map(async (log) => {
      const enemy = await EnemyUsecase.getQuizEnemy(db, log.tier);
      totalAccuracy += log.accuracy;
      return {
        ...log,
        enemy: {
          id: enemy.id,
          name: enemy.name,
          url: enemy.image.url,
        },
      };
    })
  );
  history.totalAccuracy = totalAccuracy / logs.length;

  return c.json(
    {
      user: {
        id: user.id,
        nickname: user.nickname,
        birthday: user.birthday,
        costume: {
          id: costume.id,
          name: costume.name,
          url: costume.image.url,
        },
      },
      history,
    },
    200
  );
});

app.get(
  '/history/quiz-set/:quizSetId',
  zValidator(
    'param',
    z.object({
      quizSetId: z.string(),
    })
  ),
  async (c) => {
    const quizSetId = c.req.valid('param').quizSetId;
    const firebaseUid = c.get('firebaseUid');
    const user = await UserUsecase.getUserByFirebaseUid(db, firebaseUid);
    const quizSet = await QuizLogUsecase.getQuizSetDetail(
      db,
      user.id,
      quizSetId
    );
    return c.json(
      {
        quizSet: {
          id: quizSet.id,
          accuracy: quizSet.accuracy,
          mode: quizSet.mode,
          answeredAt: formatDate(quizSet.createdAt),
        },
        quizList: quizSet.quizList,
      },
      200
    );
  }
);

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
