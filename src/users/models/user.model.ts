import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class User {
  @Field(() => ID)
  email: string;

  constructor(email: string) {
    this.email = email;
  }
}
