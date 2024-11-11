import 'dotenv/config';
import { OnModuleInit } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

export class DBService implements OnModuleInit {
  db: ReturnType<typeof drizzle<typeof schema>>;

  onModuleInit() {
    this.db = drizzle({
      client: sql,
      schema,
    });
  }
}
