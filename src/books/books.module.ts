import { Module } from '@nestjs/common';
import { BooksResolver } from './books.resolver';
import { BooksService } from './books.service';
import { DBModule } from 'src/db/db.module';

@Module({
  imports: [DBModule],
  providers: [BooksService, BooksResolver],
})
export class BooksModule {}
