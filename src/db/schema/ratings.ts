import { boolean, integer, pgTable, text } from 'drizzle-orm/pg-core';
import { booksTable } from './books';

export const ratingsTable = pgTable('ratings', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  book: integer().references(() => booksTable.id, { onDelete: 'cascade' }),
  stars: integer().notNull(),
  comment: text(),
  approved: boolean().default(false),
});
