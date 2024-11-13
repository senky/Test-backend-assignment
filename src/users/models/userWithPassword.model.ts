import { User } from "./user.model";

export class UserWithPassword extends User {
  username: string;
  password: string;
}
