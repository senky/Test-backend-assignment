import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { BooksModule } from './books/books.module';
import { DBModule } from './db/db.module';

@Module({
  imports: [
    BooksModule,
    DBModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
    }),
  ],
})
export class AppModule {}
