import {
  Args,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Book } from './models/book.model';
import { BooksService } from './books.service';
import { RatingsService } from './ratings.service';
import { Rating } from './models/rating.model';

@Resolver(() => Book)
export class BooksResolver {
  constructor(
    private booksService: BooksService,
    private ratingsService: RatingsService,
  ) {}

  @Query(() => [Book], { name: 'books' })
  async getBooks() {
    return this.booksService.findAll();
  }

  @Query(() => Book, { name: 'book' })
  async getBook(@Args('id', { type: () => ID }) id: number) {
    return this.booksService.findOneById(id);
  }

  @ResolveField('ratings', () => [Rating])
  async getRatings(@Parent() book: Book) {
    return this.ratingsService.findAllByBook(book);
  }
}
