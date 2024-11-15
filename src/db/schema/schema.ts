import { relations } from 'drizzle-orm';
import {
  boolean,
  char,
  date,
  index,
  int,
  mysqlTable,
  varchar,
} from 'drizzle-orm/mysql-core';
import { timestamps } from './columns.helpers';

/**
 * テーブル
 */
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

export const quizSetLogTable = mysqlTable('quiz_set_log', {
  id: char({ length: 36 }).primaryKey(),
  user_id: char({ length: 36 })
    .notNull()
    .references(() => usersTable.id),
  quiz_mode_id: char({ length: 36 })
    .notNull()
    .references(() => quizModeTable.id),
  ...timestamps,
});

export const quizModeTable = mysqlTable('quiz_mode', {
  id: char({ length: 36 }).primaryKey(),
  name: varchar({ length: 20 }).notNull(),
  description: varchar({ length: 100 }).notNull(),
  is_public: boolean().notNull(),
  ...timestamps,
});

export const userCostumesTable = mysqlTable('user_costumes', {
  user_id: char({ length: 36 })
    .notNull()
    .references(() => usersTable.id),
  costume_id: char({ length: 36 }).notNull(),
  ...timestamps,
});

/**
 * リレーション
 */
export const userRelations = relations(usersTable, ({ one, many }) => ({
  quizSetLog: one(quizSetLogTable),
  userCostume: many(userCostumesTable),
}));

export const quizSetLogRelations = relations(quizSetLogTable, ({ one }) => ({
  users: one(usersTable),
  quizMode: one(quizModeTable),
}));

export const quizModeRelations = relations(quizModeTable, ({ one }) => ({
  quizSetLog: one(quizSetLogTable),
}));

export const userCostumesRelations = relations(
  userCostumesTable,
  ({ one }) => ({
    user: one(usersTable),
  })
);
