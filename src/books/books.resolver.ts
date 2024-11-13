import { Args, ID, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Book } from "./models/book.model";
import { BooksService } from "./books.service";
import { Genre } from "src/db/schema";
import { BookDetail } from "./models/bookDetail.model";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { GqlThrottlerGuard } from "src/security/gql-throttler.guard";
import { GetBooksArgs } from "./args/get-books.args";
import { GetBookArgs } from "./args/get-book.args";

@Resolver(() => Book)
export class BooksResolver {
  constructor(private booksService: BooksService) {}

  @Query(() => [Book], { name: "books" })
  @UseGuards(GqlThrottlerGuard)
  async getBooks(@Args() args: GetBooksArgs) {
    return this.booksService.findAll(args);
  }

  @Query(() => BookDetail, { name: "book" })
  @UseGuards(JwtAuthGuard)
  async getBook(@Args() args: GetBookArgs) {
    return this.booksService.getBookDetail(args);
  }

  @Mutation(() => Book)
  @UseGuards(JwtAuthGuard)
  async addBook(
    @Args("title") title: string,
    @Args("author", { type: () => ID }) author: number,
    @Args("publishedYear", { type: () => Int }) publishedYear: number,
    @Args("genres", { type: () => [Genre] }) genres: Genre[],
  ) {
    return this.booksService.create(title, author, publishedYear, genres);
  }

  @Mutation(() => Book)
  @UseGuards(JwtAuthGuard)
  async editBook(
    @Args("id", { type: () => ID }) id: number,
    @Args("title") title: string,
    @Args("author", { type: () => ID }) author: number,
    @Args("publishedYear", { type: () => Int }) publishedYear: number,
    @Args("genres", { type: () => [Genre] }) genres: Genre[],
  ) {
    return this.booksService.edit(id, title, author, publishedYear, genres);
  }

  @Mutation(() => ID)
  @UseGuards(JwtAuthGuard)
  async deleteBook(@Args("id", { type: () => ID }) id: number) {
    return this.booksService.delete(id);
  }
}
