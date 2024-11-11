import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const authorsTable = pgTable('authors', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
});
