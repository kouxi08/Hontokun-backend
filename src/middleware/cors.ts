import { cors } from 'hono/cors';

export const corsMiddleware = () => {
  return cors({
    origin: [process.env.APP_BASE_URL!, 'http://localhost:8080'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'Content-Type'],
    allowHeaders: ['Content-Type', 'authorization'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  });
};

export const corsMiddlewareForMicroCMS = () => {
  return cors({
    origin: '*',
    allowMethods: ['POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  });
};
