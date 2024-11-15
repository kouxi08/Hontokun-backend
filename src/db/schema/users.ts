import {
  char,
  date,
  index,
  int,
  mysqlTable,
  varchar,
} from 'drizzle-orm/mysql-core';
import { timestamps } from './columns.helpers';

export const usersTable = mysqlTable(
  'users',
  {
    id: char({ length: 36 }).primaryKey(),
    firebase_uid: varchar({ length: 128 }).notNull().unique(),
    nickname: varchar({ length: 20 }).notNull(),
    birthday: date(),
    level: int().default(1).notNull(),
    experience: int().default(0).notNull(),
    costume_id: char({ length: 36 }),
    ...timestamps,
  },
  (table) => {
    return {
      firebaseIdIdx: index('firebase_uid').on(table.firebase_uid),
    };
  }
);
