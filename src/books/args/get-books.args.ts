import { ArgsType, Field, Int } from "@nestjs/graphql";

@ArgsType()
export class GetBooksArgs {
  @Field({ nullable: true })
  authorName?: string;

  @Field({ nullable: true })
  bookTitle?: string;

  @Field(() => Int, { description: "Limit is always set to 10 items." })
  offset: number = 0;

  // In ideal world we would have this field as well, but drizzle doesn't support offset of sub-level queries.
  // @Field(() => Int, { description: "Reviews limit is always set to 10 items." })
  // reviewsOffset: number = 0;
}
