import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Author {
  @Field(() => ID)
  id: number;
  name: string;

  constructor(author: Author) {
    Object.assign(this, author);
  }
}
