import { Book } from "./models/book.model";
import { DBService } from "src/db/db.service";
import { eq, ilike } from "drizzle-orm";
import {
  booksHistoryTable,
  booksTable,
  Genre,
  ratingsTable,
} from "src/db/schema";
import { Injectable } from "@nestjs/common";

/**
 * TODO: make sure to only query author and ratings if needed.
 */

@Injectable()
export class BooksService {
  constructor(private dbService: DBService) {}

  async findAll(authorName?: string, bookTitle?: string): Promise<Book[]> {
    const books = await this.dbService.db.query.booksTable
      .findMany({
        where: bookTitle
          ? ilike(booksTable.title, `%${bookTitle}%`)
          : undefined,
        with: {
          author: true,
          ratings: {
            columns: {
              book: false,
              approved: false,
            },
            where: eq(ratingsTable.approved, true),
          },
        },
      })
      // I am fully aware that this is suboptimal, but drizzle in current state doesn't allow
      // "parent" filtering: https://github.com/drizzle-team/drizzle-orm/discussions/1152
      // The discussion includes suggested workaround but that is so hart to read I prefer this
      // solution while app usage is low.
      .then((result) =>
        authorName
          ? result.filter(({ author }) => author.name.includes(authorName))
          : result,
      );

    return books.map((book) => new Book(book));
  }

  async findOneById(id: number): Promise<Book> {
    const book = await this.dbService.db.query.booksTable.findFirst({
      with: {
        author: true,
        ratings: {
          columns: {
            book: false,
            approved: false,
          },
          where: eq(ratingsTable.approved, true),
        },
      },
      where: eq(booksTable.id, id),
    });
    return new Book(book);
  }

  async create(
    title: string,
    author: number,
    publishedYear: number,
    genres: Genre[],
  ): Promise<Book> {
    const book = await this.dbService.db
      .insert(booksTable)
      .values({
        title,
        author,
        publishedYear,
        genres,
      })
      .returning();

    // Since `.returning()` doesn't return the relations, we need to fetch the book again.
    return this.findOneById(book[0].id);
  }

  async edit(
    id: number,
    title: string,
    author: number,
    publishedYear: number,
    genres: Genre[],
  ): Promise<Book> {
    await this.addHistoryRecord(id);

    // Update current version of the book.
    const editedBook = await this.dbService.db
      .update(booksTable)
      .set({
        title,
        author,
        publishedYear,
        genres,
      })
      .where(eq(booksTable.id, id))
      .returning();

    // Since `.returning()` doesn't return the relations, we need to fetch the book again.
    return this.findOneById(editedBook[0].id);
  }

  private async addHistoryRecord(id: number): Promise<void> {
    const book = await this.dbService.db.query.booksTable.findFirst({
      where: eq(booksTable.id, id),
    });

    await this.dbService.db.insert(booksHistoryTable).values({
      // outdatedFrom is set to current date by default
      id: book.id,
      title: book.title,
      author: book.author,
      publishedYear: book.publishedYear,
      genres: book.genres,
    });
  }
}
