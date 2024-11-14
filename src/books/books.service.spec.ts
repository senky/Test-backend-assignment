import { Test } from "@nestjs/testing";
import { DBService } from "../db/db.service";
import { BooksService } from "./books.service";
import { Book } from "./models/book.model";
import { BookDetail } from "./models/book-detail.model";
import { NotFoundException } from "@nestjs/common";
import { booksHistoryTable } from "../db/schema";

const books = [
  {
    id: 1,
    title: "Book 1",
    author: {
      id: 1,
      name: "Author 1",
    },
    publishedYear: 2021,
    genres: [],
    ratings: [],
  },
  {
    id: 12,
    title: "Book 2 fantasy",
    author: {
      id: 1,
      name: "Author 1",
    },
    publishedYear: 2021,
    genres: [],
    ratings: [],
  },
  {
    id: 1,
    title: "Book 3 fantasy",
    author: {
      id: 2,
      name: "Author 2",
    },
    publishedYear: 2021,
    genres: [],
    ratings: [],
  },
];

const updateSet = jest.fn();
const updateWhere = jest.fn();
const updateReturning = jest.fn();
const dbResponse = {
  set: updateSet,
  where: updateWhere,
  returning: updateReturning,
};
updateSet.mockImplementation(() => dbResponse);
updateWhere.mockImplementation(() => dbResponse);
updateReturning.mockImplementation(() => dbResponse);
const dbMock = {
  query: {
    booksTable: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    booksHistoryTable: {
      findMany: jest.fn(),
    },
  },
  insert: jest.fn().mockImplementation(() => ({
    values: jest.fn(),
  })),
  update: jest.fn().mockImplementation(() => dbResponse),
  delete: jest.fn().mockImplementation(() => dbResponse),
};

describe("BooksService", () => {
  let booksService: BooksService;
  let dbServiceMock = {
    db: dbMock,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [DBService, BooksService],
    })
      .overrideProvider(DBService)
      .useValue(dbServiceMock)
      .compile();

    booksService = moduleRef.get(BooksService);
    dbServiceMock = moduleRef.get(DBService);
  });

  describe("findAll", () => {
    it("should return all books if no arg is provided", async () => {
      dbServiceMock.db.query.booksTable.findMany.mockResolvedValueOnce(books);
      expect(await booksService.findAll({})).toEqual(
        books.map((book) => new Book(book)),
      );
    });

    it("should return only 'author 1' books", async () => {
      dbServiceMock.db.query.booksTable.findMany.mockResolvedValueOnce(books);
      expect(await booksService.findAll({ authorName: "Author 1" })).toEqual(
        books
          .filter(({ author }) => author.name === "Author 1")
          .map((book) => new Book(book)),
      );
    });

    it("should return all books with 'fantasy' in name", async () => {
      const fantasyBooks = books.filter(({ title }) =>
        title.includes("fantasy"),
      );
      dbServiceMock.db.query.booksTable.findMany.mockResolvedValueOnce(
        fantasyBooks,
      );
      expect(await booksService.findAll({ bookTitle: "fantasy" })).toEqual(
        fantasyBooks.map((book) => new Book(book)),
      );
    });

    it("should return all books with 'fantasy' in name from 'Author 1'", async () => {
      const fantasyBooks = books.filter(({ title }) =>
        title.includes("fantasy"),
      );
      dbServiceMock.db.query.booksTable.findMany.mockResolvedValueOnce(
        fantasyBooks,
      );
      expect(
        await booksService.findAll({
          authorName: "Author 1",
          bookTitle: "fantasy",
        }),
      ).toEqual(
        fantasyBooks
          .filter(({ author }) => author.name === "Author 1")
          .map((book) => new Book(book)),
      );
    });

    it("should return only 10 books", async () => {
      const aLotOfBooks = books.concat(books).concat(books).concat(books);
      dbServiceMock.db.query.booksTable.findMany.mockResolvedValueOnce(
        aLotOfBooks.slice(0, 10),
      );
      expect(await booksService.findAll({})).toHaveLength(10);
    });

    // TODO: add test for 10 books with offset while filtering by author name
  });

  describe("getBookDetail", () => {
    const book = books[0];
    const history = [
      book,
      book,
      book,
      book,
      book,
      book,
      book,
      book,
      book,
      book,
      { ...book, title: "11th version" },
    ];

    it("should return book detail when ID exists", async () => {
      const offset = 0;
      dbServiceMock.db.query.booksTable.findFirst.mockResolvedValueOnce(book);
      dbServiceMock.db.query.booksHistoryTable.findMany.mockResolvedValueOnce(
        history.slice(offset, offset + 10),
      );
      expect(
        await booksService.getBookDetail({ id: 1, historyOffset: offset }),
      ).toEqual(new BookDetail(book, history.slice(offset, offset + 10)));
    });

    it("should return older versions when offset is set", async () => {
      const offset = 10;
      dbServiceMock.db.query.booksTable.findFirst.mockResolvedValueOnce(book);
      dbServiceMock.db.query.booksHistoryTable.findMany.mockResolvedValueOnce(
        history.slice(offset, offset + 10),
      );
      expect(
        await booksService.getBookDetail({ id: 1, historyOffset: offset }),
      ).toEqual(new BookDetail(book, history.slice(offset, offset + 10)));
    });

    it("should return NotFoundException when ID doesn't exist", async () => {
      dbServiceMock.db.query.booksTable.findFirst.mockResolvedValueOnce(null);
      await expect(
        booksService.getBookDetail({ id: 2, historyOffset: 0 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("create", () => {
    // I don't think this needs test as it is just forwarding data to DB.
  });

  describe("edit", () => {
    it("should add history record when editing book", async () => {
      dbServiceMock.db.query.booksTable.findFirst.mockResolvedValue(books[0]);
      updateReturning.mockResolvedValueOnce([books[0]]);
      await booksService.edit(1, "Book 1 update", 1, 2021, []);
      expect(dbServiceMock.db.insert).toHaveBeenCalledWith(booksHistoryTable);
    });
  });

  describe("delete", () => {
    it("should add history record when deleting book", async () => {
      dbServiceMock.db.query.booksTable.findFirst.mockResolvedValue(books[0]);
      updateReturning.mockResolvedValueOnce([books[0]]);
      await booksService.delete(1);
      expect(dbServiceMock.db.insert).toHaveBeenCalledWith(booksHistoryTable);
    });
  });
});
