import { Field, ObjectType } from "@nestjs/graphql";
import { Book } from "./book.model";

@ObjectType()
export class BookDetail {
  @Field(() => Book)
  book: Book;

  @Field(() => [Book])
  history: Book[];

  constructor(book: Book, history: Book[]) {
    this.book = book;
    this.history = history;
  }
}
