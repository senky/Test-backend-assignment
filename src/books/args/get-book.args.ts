import { ArgsType, Field, ID, Int } from "@nestjs/graphql";

@ArgsType()
export class GetBookArgs {
  @Field(() => ID)
  id: number;

  // In ideal world we would have this field as well, but drizzle doesn't support offset of sub-level queries.
  // @Field(() => Int, { description: "Reviews limit is always set to 10 items." })
  // reviewsOffset: number = 0;

  @Field(() => Int, { description: "History is always set to 10 items." })
  historyOffset: number = 0;
}
