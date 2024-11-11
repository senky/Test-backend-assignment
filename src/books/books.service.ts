import { Book } from './models/book.model';
import { DBService } from 'src/db/db.service';
import { eq } from 'drizzle-orm';
import { booksTable, ratingsTable } from 'src/db/schema';
import { Injectable } from '@nestjs/common';

/**
 * TODO: make sure to only query author and ratings if needed.
 */

@Injectable()
export class BooksService {
  constructor(private dbService: DBService) {}

  async findAll(): Promise<Book[]> {
    const books = await this.dbService.db.query.booksTable.findMany({
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
    });

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
}
