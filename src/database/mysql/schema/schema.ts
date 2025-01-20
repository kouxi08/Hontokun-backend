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
import { timestamps } from './columns.helpers.js';

/**
 * テーブル
 */
export const usersTable = mysqlTable(
  'users',
  {
    id: char({ length: 36 }).primaryKey(),
    firebaseUid: varchar({ length: 128 }).notNull().unique(),
    nickname: varchar({ length: 20 }).notNull(),
    birthday: date(),
    level: int().default(1).notNull(),
    experience: int().default(0).notNull(),
    costumeId: char({ length: 36 }).notNull(),
    ...timestamps,
  },
  (table) => {
    return {
      firebaseIdIdx: index('firebase_uid').on(table.firebaseUid),
    };
  }
);

export const quizTable = mysqlTable('quiz', {
  id: char({ length: 36 }).primaryKey(),
  title: varchar({ length: 50 }).notNull(),
  content: text().notNull(),
  tier: int().notNull(),
  imageUrl: varchar({ length: 500 }),
  imageHeight: int(),
  imageWidth: int(),
  question: text().notNull(),
  newsUrl: text().notNull(),
  type: varchar({ length: 20 }).notNull(),
  answer: text().notNull(),
  explanation: text().notNull(),
  hint: text().notNull(),
  keyword: text().notNull(),
  isDeleted: boolean().default(false).notNull(),
  ...timestamps,
  publishedAt: date().notNull(),
  revisedAt: date().notNull(),
});

export const quizSetLogTable = mysqlTable('quiz_set_log', {
  id: char({ length: 36 }).primaryKey(),
  userId: char({ length: 36 })
    .notNull()
    .references(() => usersTable.id),
  quizModeId: char({ length: 36 })
    .notNull()
    .references(() => quizModeTable.id),
  ...timestamps,
});

export const quizLogTable = mysqlTable(
  'quizLog',
  {
    id: char({ length: 36 }).primaryKey(),
    quizId: char({ length: 36 })
      .notNull()
      .references(() => quizTable.id),
    quizSetLogId: char({ length: 36 })
      .notNull()
      .references(() => quizSetLogTable.id),
    userAnswer: text().notNull(),
    time: int(),
    isCorrect: boolean().notNull(),
    ...timestamps,
  },
  (table) => ({
    timeCheck: check('timeCheck', sql`${table.time} >= 0`),
  })
);

export const quizModeTable = mysqlTable('quiz_mode', {
  id: char({ length: 36 }).primaryKey(),
  name: varchar({ length: 20 }).notNull(),
  description: varchar({ length: 100 }).notNull(),
  isPublic: boolean().notNull(),
  ...timestamps,
});

export const quizChoiceTable = mysqlTable('quiz_choice', {
  id: int().primaryKey().autoincrement(),
  quizId: char({ length: 36 })
    .notNull()
    .references(() => quizTable.id),
  name: varchar({ length: 50 }).notNull(),
  ...timestamps,
});

export const userCostumesTable = mysqlTable('user_costumes', {
  userId: char({ length: 36 })
    .notNull()
    .references(() => usersTable.id),
  costumeId: char({ length: 36 }).notNull(),
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
  quizChoice: many(quizChoiceTable),
}));

export const quizSetLogRelations = relations(
  quizSetLogTable,
  ({ one, many }) => ({
    user: one(usersTable, {
      fields: [quizSetLogTable.userId],
      references: [usersTable.id],
      relationName: 'quizSetLogs',
    }),
    quizMode: one(quizModeTable, {
      fields: [quizSetLogTable.quizModeId],
      references: [quizModeTable.id],
      relationName: 'quizSetLogs',
    }),
    quizLogs: many(quizLogTable),
  })
);

export const quizLogRelations = relations(quizLogTable, ({ one }) => ({
  quizSetLog: one(quizSetLogTable, {
    fields: [quizLogTable.quizSetLogId],
    references: [quizSetLogTable.id],
    relationName: 'quizLogs',
  }),
  quiz: one(quizTable, {
    fields: [quizLogTable.quizId],
    references: [quizTable.id],
    relationName: 'quizLogs',
  }),
}));

export const quizModeRelations = relations(quizModeTable, ({ many }) => ({
  quizSetLogs: many(quizSetLogTable),
}));

export const quizChoiceRelations = relations(quizChoiceTable, ({ one }) => ({
  quiz: one(quizTable, {
    fields: [quizChoiceTable.quizId],
    references: [quizTable.id],
    relationName: 'quizChoices',
  }),
}));

export const userCostumesRelations = relations(
  userCostumesTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [userCostumesTable.userId],
      references: [usersTable.id],
      relationName: 'userCostumes',
    }),
  })
);
