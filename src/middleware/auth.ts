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
      await next();
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        if (error.name === 'auth/argument-error') {
          throw new AuthError('Token is malformed');
        } else if (error.name === 'auth/id-token-expired') {
          throw new AuthError('Token has expired');
        } else if (error.name === 'auth/id-token-revoked') {
          throw new AuthError('Token has been revoked');
        } else {
          throw new AuthError('Failed to verify token');
        }
      }
      throw new AuthError('An unknown error occurred');
    }
  });
};

export { createAuthMiddleware };
