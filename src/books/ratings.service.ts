import { Book } from './models/book.model';
import { Rating } from './models/rating.model';

export class RatingsService {
  findAllByBook(book: Book): Rating[] {
    return [
      { id: 1, book, stars: 5, comment: '', approved: true },
      { id: 2, book, stars: 5, comment: '', approved: true },
      { id: 3, book, stars: 5, comment: '', approved: false },
    ];
  }
}
