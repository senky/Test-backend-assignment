import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { BooksModule } from "./books/books.module";
import { DBModule } from "./db/db.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ThrottlerModule } from "@nestjs/throttler";

@Module({
  imports: [
    BooksModule,
    DBModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      // A dumb way to tell the GraphQL to include response to context: https://github.com/nestjs/throttler/issues/1437
      context: ({ req, res }) => ({ req, res }),
    }),
    AuthModule,
    UsersModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
})
export class AppModule {}
