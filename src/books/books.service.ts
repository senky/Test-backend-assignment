import { Book } from "./models/book.model";
import { DBService } from "../db/db.service";
import { eq, ilike } from "drizzle-orm";
import {
  booksHistoryTable,
  booksTable,
  Genre,
  ratingsTable,
} from "../db/schema";
import { Injectable, NotFoundException } from "@nestjs/common";
import { BookDetail } from "./models/book-detail.model";

/**
 * TODO: make sure to only query author and ratings if needed.
 */

@Injectable()
export class BooksService {
  constructor(private dbService: DBService) {}

  async findAll({
    authorName,
    bookTitle,
    offset,
  }: {
    authorName?: string;
    bookTitle?: string;
    offset?: number;
  }): Promise<Book[]> {
    const books = await this.dbService.db.query.booksTable
      .findMany({
        where: bookTitle
          ? ilike(booksTable.title, `%${bookTitle}%`)
          : undefined,
        limit: 10,
        offset,
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
      // BUG: We want to return 10 books, but this reduces it down to potentially 0!
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

  async getBookDetail({
    id,
    historyOffset,
  }: {
    id: number;
    historyOffset: number;
  }): Promise<BookDetail> {
    const currentState = await this.findOneById(id);
    const history = await this.dbService.db.query.booksHistoryTable.findMany({
      where: eq(booksHistoryTable.id, id),
      limit: 10,
      offset: historyOffset,
      with: {
        author: true,
        ratings: {
          columns: {
            book: false,
            // Since this query is only used by logged in users we do not limit reviews by approval.
          },
        },
      },
    });

    return new BookDetail(currentState, history);
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

  async delete(id: number): Promise<number> {
    await this.addHistoryRecord(id);

    const deletedBook = await this.dbService.db
      .delete(booksTable)
      .where(eq(booksTable.id, id))
      .returning();

    if (!deletedBook || deletedBook.length === 0) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

    return deletedBook[0].id;
  }

  private async findOneById(id: number): Promise<Book> {
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

    // TODO Maybe we don't want to throw an error here to allow `getBookDetail` return history even after book doesn't exist.
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    return new Book(book);
  }

  private async addHistoryRecord(id: number): Promise<void> {
    const book = await this.dbService.db.query.booksTable.findFirst({
      where: eq(booksTable.id, id),
    });

    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

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
