import { cors } from 'hono/cors';

export const corsMiddleware = () => {
  return cors({
    origin: '*',
    allowMethods: ['POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  });
};
