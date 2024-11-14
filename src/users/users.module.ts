import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { DBModule } from "../db/db.module";
import { UsersResolver } from "./users.resolver";

@Module({
  imports: [DBModule],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
