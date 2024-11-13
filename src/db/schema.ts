import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

export const authorsTable = pgTable("authors", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
});

export enum Genre {
  SCIENCE_FICTION = "Science Fiction",
  ROMANCE = "Romance",
  PERSONAL_DEVELOPMENT = "Personal Development",
  FANTASY = "Fantasy",
  THRILLER = "Thriller",
}

// Hack taken from: https://github.com/drizzle-team/drizzle-orm/discussions/1914#discussioncomment-9600199
function enumToPgEnum<T extends Record<string, any>>(
  myEnum: T,
): [T[keyof T], ...T[keyof T][]] {
  return Object.values(myEnum).map((value) => `${value}`) as any;
}
export const genre = pgEnum("genre", enumToPgEnum(Genre));

export const booksTable = pgTable("books", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar().notNull(),
  author: integer()
    .notNull()
    .references(() => authorsTable.id, { onDelete: "cascade" }),
  publishedYear: integer().notNull(),
  genres: genre().array().notNull(),
});

export const booksHistoryTable = pgTable(
  "booksHistory",
  {
    outdatedFrom: timestamp().notNull().defaultNow(),
    id: integer().notNull(),
    title: varchar().notNull(),
    author: integer()
      .notNull()
      .references(() => authorsTable.id),
    publishedYear: integer().notNull(),
    genres: genre().array().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.outdatedFrom, table.id] }),
  }),
);

export const ratingsTable = pgTable("ratings", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  book: integer().references(() => booksTable.id, { onDelete: "cascade" }),
  stars: integer().notNull(),
  comment: text(),
  approved: boolean().default(false),
});

export const usersTable = pgTable("users", {
  email: text().primaryKey(),
  password: text().notNull(),
});

export const authorRelations = relations(authorsTable, ({ many }) => ({
  books: many(booksTable),
  booksHistory: many(booksHistoryTable),
}));

export const bookRelations = relations(booksTable, ({ many, one }) => ({
  author: one(authorsTable, {
    fields: [booksTable.author],
    references: [authorsTable.id],
  }),
  ratings: many(ratingsTable),
}));

export const bookHistoryRelations = relations(
  booksHistoryTable,
  ({ many, one }) => ({
    author: one(authorsTable, {
      fields: [booksHistoryTable.author],
      references: [authorsTable.id],
    }),
    ratings: many(ratingsTable),
  }),
);

export const ratingRelations = relations(ratingsTable, ({ one }) => ({
  book: one(booksTable, {
    fields: [ratingsTable.book],
    references: [booksTable.id],
  }),
  bookHistory: one(booksHistoryTable, {
    fields: [ratingsTable.book],
    references: [booksHistoryTable.id],
  }),
}));
