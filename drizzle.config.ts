import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { DATABASE_URL } from './src/config/env.js';

export default defineConfig({
  out: './drizzle',
  schema: './src/database/mysql/schema/schema.ts',
  casing: 'snake_case',
  dialect: 'mysql',
  dbCredentials: {
    url: DATABASE_URL,
  },
  migrations: {
    table: 'migrations',
    schema: 'drizzle',
  },
});
