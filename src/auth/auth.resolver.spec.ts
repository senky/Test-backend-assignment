import { Test } from "@nestjs/testing";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import { User } from "../users/models/user.model";
import { ThrottlerModule } from "@nestjs/throttler";
import { UnauthorizedException } from "@nestjs/common";

describe("AuthResolver", () => {
  let authResolver: AuthResolver;
  let authServiceMock: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthResolver],
      imports: [
        ThrottlerModule.forRoot([
          {
            ttl: Infinity,
            limit: Infinity,
          },
        ]),
      ],
    })
      .useMocker((token) => {
        if (token === AuthService) {
          return {
            validateUser: jest.fn(),
            login: jest.fn(),
          };
        }
      })
      .compile();

    authResolver = moduleRef.get(AuthResolver);
    authServiceMock = moduleRef.get(AuthService);
  });

  describe("login", () => {
    it("should return an AuthResponse when email/password combination is correct", async () => {
      authServiceMock.validateUser.mockResolvedValueOnce(
        new User("test@email"),
      );
      const loginResponse = {
        access_token: "token",
      };
      authServiceMock.login.mockReturnValueOnce(loginResponse);
      expect(await authResolver.login("test@email", "password")).toEqual(
        loginResponse,
      );
    });

    it("should throw an UnauthorizedException when email/password combination is incorrect", async () => {
      authServiceMock.validateUser.mockResolvedValueOnce(null);
      await expect(
        authResolver.login("test@email", "password"),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
