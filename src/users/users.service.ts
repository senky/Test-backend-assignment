import { Injectable } from "@nestjs/common";
import { UserWithPassword } from "./models/userWithPassword.model";

@Injectable()
export class UsersService {
  private readonly users = [
    {
      username: "john",
      password: "changeme",
    },
    {
      username: "maria",
      password: "guess",
    },
  ];

  async findOne(username: string): Promise<UserWithPassword | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
