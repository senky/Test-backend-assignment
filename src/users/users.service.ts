import { Injectable, NotFoundException } from "@nestjs/common";
import { DBService } from "../db/db.service";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcrypt";
import { User } from "./models/user.model";

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(private dbService: DBService) {}

  async isCorrectPassword(email: string, plainPassword: string) {
    const user = await this.dbService.db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });

    if (!user) {
      throw new NotFoundException();
    }

    return bcrypt.compare(plainPassword, user.password);
  }

  async create(email: string, plainPassword: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);

    try {
      const user = await this.dbService.db
        .insert(usersTable)
        .values({
          email,
          password: hashedPassword,
        })
        .returning();

      if (!user || user.length === 0) {
        throw new Error();
      }

      return new User(user[0].email);
    } catch {
      throw new Error("Failed to create user");
    }
  }
}
