import type { app } from 'firebase-admin';
import { createMiddleware } from 'hono/factory';
import { AuthError } from '../error';
import type { Variables } from '../variables';

const createAuthMiddleware = (firebaseApp: app.App) => {
  return createMiddleware<{ Variables: Variables }>(async (c, next) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      throw new AuthError('Authorization header is missing');
    }

    const token = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await firebaseApp.auth().verifyIdToken(token);
      c.set('firebaseUserId', decodedToken.uid);
    } catch (error) {
      throw new AuthError();
    } finally {
      await next();
    }
  });
};

export { createAuthMiddleware };
