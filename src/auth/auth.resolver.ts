import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { Resolver, GqlExecutionContext, Mutation, Args } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { AuthResponse } from "./models/auth-response.model";
import { GqlThrottlerGuard } from "../security/gql-throttler.guard";

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponse)
  @UseGuards(GqlThrottlerGuard)
  async login(
    @Args("email") email: string,
    @Args("password") password: string,
  ) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }
}
