import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { Book } from './book.model';

@ObjectType()
export class Rating {
  @Field(() => ID)
  id: number;
  book: Book;
  stars: number;
  comment?: string;

  @HideField()
  approved: boolean;
}
