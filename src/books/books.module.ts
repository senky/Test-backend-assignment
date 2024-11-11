import { Module } from '@nestjs/common';
import { BooksResolver } from './books.resolver';
import { BooksService } from './books.service';
import { RatingsService } from './ratings.service';

@Module({
  providers: [BooksService, RatingsService, BooksResolver],
})
export class BooksModule {}
