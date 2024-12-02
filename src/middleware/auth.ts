import type { app } from 'firebase-admin';
import { createMiddleware } from 'hono/factory';
import { AuthError } from '../core/error';
import type { Variables } from '../core/variables';

const createAuthMiddleware = (firebaseApp: app.App) => {
  return createMiddleware<{ Variables: Variables }>(async (c, next) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      throw new AuthError('Authorization header is missing');
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      throw new AuthError('Bearer token is missing');
    }

    try {
      const decodedToken = await firebaseApp.auth().verifyIdToken(token);
      c.set('firebaseUid', decodedToken.uid);
    } catch (error) {
      throw new AuthError();
    } finally {
      await next();
    }
  });
};

export { createAuthMiddleware };
