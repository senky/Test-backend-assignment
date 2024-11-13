import { Args, ID, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Book } from "./models/book.model";
import { BooksService } from "./books.service";
import { Genre } from "src/db/schema";
import { BookDetail } from "./models/bookDetail.model";

@Resolver(() => Book)
export class BooksResolver {
  constructor(private booksService: BooksService) {}

  @Query(() => [Book], { name: "books" })
  async getBooks(
    @Args("authorName", { nullable: true }) authorName?: string,
    @Args("bookTitle", { nullable: true }) bookTitle?: string,
  ) {
    return this.booksService.findAll(authorName, bookTitle);
  }

  @Query(() => BookDetail, { name: "book" })
  async getBook(@Args("id", { type: () => ID }) id: number) {
    return this.booksService.getBookDetail(id);
  }

  @Mutation(() => Book)
  async addBook(
    @Args("title") title: string,
    @Args("author", { type: () => ID }) author: number,
    @Args("publishedYear", { type: () => Int }) publishedYear: number,
    @Args("genres", { type: () => [Genre] }) genres: Genre[],
  ) {
    return this.booksService.create(title, author, publishedYear, genres);
  }

  @Mutation(() => Book)
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
  async deleteBook(@Args("id", { type: () => ID }) id: number) {
    return this.booksService.delete(id);
  }
}
