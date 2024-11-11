import { integer, pgEnum, pgTable, varchar } from 'drizzle-orm/pg-core';
import { authorsTable } from './authors';

export const genre = pgEnum('genre', [
  'Science Fiction',
  'Romance',
  'Personal Development',
  'Fantasy',
  'Thriller',
]);

export const booksTable = pgTable('books', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar().notNull(),
  author: integer().references(() => authorsTable.id, { onDelete: 'cascade' }),
  publishedYear: integer().notNull(),
  genres: genre().array().notNull(),
});
