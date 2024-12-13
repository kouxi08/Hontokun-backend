import { timestamp } from 'drizzle-orm/mysql-core';

export const timestamps = {
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date()).notNull(),
};
