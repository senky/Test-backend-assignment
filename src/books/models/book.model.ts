import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Author } from './author.model';
import { Rating } from './rating.model';

export enum Genre {
  SCIENCE_FICTION = 'Science Fiction',
  ROMANCE = 'Romance',
  PERSONAL_DEVELOPMENT = 'Personal Development',
  FANTASY = 'Fantasy',
  THRILLER = 'Thriller',
}
registerEnumType(Genre, {
  name: 'Genre',
});

@ObjectType()
export class Book {
  @Field(() => ID)
  id: number;
  title: string;
  author: Author;
  publishedYear: number;
  genres: Genre[];
  ratings: Rating[];
}
