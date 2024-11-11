import { Book, Genre } from './models/book.model';

const books: Book[] = [
  {
    id: 1,
    title: 'Book 1',
    author: {
      id: 1,
      name: 'Author 1',
    },
    publishedYear: 2021,
    genres: [Genre.FANTASY],
    ratings: [],
  },
  {
    id: 2,
    title: 'Book 2',
    author: {
      id: 1,
      name: 'Author 1',
    },
    publishedYear: 2021,
    genres: [Genre.FANTASY],
    ratings: [],
  },
];

export class BooksService {
  findAll(): Book[] {
    return books;
  }

  findOneById(id: number): Book {
    return books.find((book) => book.id === id);
  }
}
