import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { User } from "./models/user.model";
import { GqlThrottlerGuard } from "src/security/gql-throttler.guard";
import { UseGuards } from "@nestjs/common";

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Mutation(() => User)
  @UseGuards(GqlThrottlerGuard)
  async register(
    @Args("email") email: string,
    @Args("password") password: string,
  ) {
    return await this.usersService.create(email, password);
  }
}
