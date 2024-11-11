import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  varchar,
} from 'drizzle-orm/pg-core';

export const authorsTable = pgTable('authors', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
});

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

export const ratingsTable = pgTable('ratings', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  book: integer().references(() => booksTable.id, { onDelete: 'cascade' }),
  stars: integer().notNull(),
  comment: text(),
  approved: boolean().default(false),
});
