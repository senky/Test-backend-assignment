import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { Book } from './book.model';

/**
 * TODO: Think really hard how we can reuse DB schema to define these models.
 *
 * For example I was able to extract columns with types like this:
 * ```
 * type Keys = {
 *   [Column in keyof typeof ratingsTable._.columns]: (typeof ratingsTable)[Column]['_']['data'];
 * };
 * ```
 * but it feels random to access `_` prop and references to other models are troublesome (`book` is `number` in `Keys`).
 */

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
