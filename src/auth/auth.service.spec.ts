import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { User } from "../users/models/user.model";

describe("AuthService", () => {
  let authService: AuthService;
  let usersServiceMock: jest.Mocked<UsersService>;
  let jwtServiceMock: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((token) => {
        if (token === UsersService) {
          return {
            isCorrectPassword: jest.fn(),
          };
        }
        if (token === JwtService) {
          return {
            sign: jest.fn(),
          };
        }
      })
      .compile();

    authService = moduleRef.get(AuthService);
    usersServiceMock = moduleRef.get(UsersService);
    jwtServiceMock = moduleRef.get(JwtService);
  });

  describe("validateUser", () => {
    it("should return user object if password is correct", async () => {
      usersServiceMock.isCorrectPassword.mockResolvedValueOnce(true);
      expect(
        await authService.validateUser("test@email", "password"),
      ).toMatchObject({
        email: "test@email",
      });
    });

    it("should return null if password is not correct", async () => {
      usersServiceMock.isCorrectPassword.mockResolvedValueOnce(false);
      expect(
        await authService.validateUser("test@email", "password"),
      ).toBeNull();
    });
  });

  describe("login", () => {
    it("should return an object with access_token", async () => {
      jwtServiceMock.sign.mockReturnValueOnce("token");
      expect(await authService.login(new User("test@email"))).toMatchObject({
        access_token: "token",
      });
    });
  });
});
