import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { User } from "./models/user.model";

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Mutation(() => User)
  async register(
    @Args("email") email: string,
    @Args("password") password: string,
  ) {
    return await this.usersService.create(email, password);
  }
}
