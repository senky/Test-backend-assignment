import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { Book } from './models/book.model';
import { BooksService } from './books.service';

@Resolver(() => Book)
export class BooksResolver {
  constructor(private booksService: BooksService) {}

  @Query(() => [Book], { name: 'books' })
  async getBooks(
    @Args('authorName', { nullable: true }) authorName?: string,
    @Args('bookTitle', { nullable: true }) bookTitle?: string,
  ) {
    return this.booksService.findAll(authorName, bookTitle);
  }

  @Query(() => Book, { name: 'book' })
  async getBook(@Args('id', { type: () => ID }) id: number) {
    return this.booksService.findOneById(id);
  }
}
