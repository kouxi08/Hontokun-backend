import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  char,
  check,
  date,
  index,
  int,
  mysqlTable,
  text,
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

export const quizTable = mysqlTable('quiz', {
  id: char({ length: 36 }).primaryKey(),
  title: varchar({ length: 50 }).notNull(),
  content: text().notNull(),
  tier: int().notNull(),
  image_url: varchar({ length: 500 }),
  image_height: int(),
  image_width: int(),
  question: text().notNull(),
  news_url: text().notNull(),
  type: varchar({ length: 20 }).notNull(),
  answer: text().notNull(),
  explanation: text().notNull(),
  hint: text().notNull(),
  keyword: text().notNull(),
  is_deleted: boolean().default(false).notNull(),
  ...timestamps,
  published_at: date().notNull(),
  revised_at: date().notNull(),
});

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

export const quizLogTable = mysqlTable(
  'quiz_log',
  {
    id: char({ length: 36 }).primaryKey(),
    quiz_id: char({ length: 36 })
      .notNull()
      .references(() => quizTable.id),
    quiz_set_log_id: char({ length: 36 })
      .notNull()
      .references(() => quizSetLogTable.id),
    user_answer: text().notNull(),
    time: int(),
    is_correct: boolean().notNull(),
    ...timestamps,
  },
  (table) => ({
    timeCheck: check('time_check', sql`${table.time} >= 0`),
  })
);

export const quizModeTable = mysqlTable('quiz_mode', {
  id: char({ length: 36 }).primaryKey(),
  name: varchar({ length: 20 }).notNull(),
  description: varchar({ length: 100 }).notNull(),
  is_public: boolean().notNull(),
  ...timestamps,
});

export const quizChoiceTable = mysqlTable('quiz_choice', {
  id: int().primaryKey().autoincrement(),
  quiz_id: char({ length: 36 })
    .notNull()
    .references(() => quizTable.id),
  name: varchar({ length: 50 }).notNull(),
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
export const userRelations = relations(usersTable, ({ many }) => ({
  quizSetLogs: many(quizSetLogTable),
  userCostumes: many(userCostumesTable),
}));

export const quizRelations = relations(quizTable, ({ many }) => ({
  quizLog: many(quizLogTable),
  quizChoices: many(quizChoiceTable),
}));

export const quizSetLogRelations = relations(
  quizSetLogTable,
  ({ one, many }) => ({
    user: one(usersTable),
    quizMode: one(quizModeTable),
    quizLogs: many(quizLogTable),
  })
);

export const quizLogRelations = relations(quizLogTable, ({ one }) => ({
  quizSetLog: one(quizSetLogTable),
  quiz: one(quizTable),
}));

export const quizModeRelations = relations(quizModeTable, ({ many }) => ({
  quizSetLogs: many(quizSetLogTable),
}));

export const quizChoiceRelations = relations(quizChoiceTable, ({ one }) => ({
  quiz: one(quizTable),
}));

export const userCostumesRelations = relations(
  userCostumesTable,
  ({ one }) => ({
    user: one(usersTable),
  })
);
