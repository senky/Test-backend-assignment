import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Author } from './author.model';
import { Rating } from './rating.model';
import { Genre } from 'src/db/schema';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

registerEnumType(Genre, {
  name: 'Genre',
});

@ObjectType()
export class Book {
  @Field(() => ID)
  id: number;
  title: string;
  author?: Author;
  publishedYear: number;
  genres: Genre[];
  ratings?: Rating[];

  constructor(book: Optional<Book, 'author' | 'ratings'>) {
    this.id = book.id;
    this.title = book.title;
    this.author = book.author ? new Author(book.author) : undefined;
    this.publishedYear = book.publishedYear;
    this.genres = book.genres;
    this.ratings = book.ratings.map((rating) => new Rating(rating));
  }
}
