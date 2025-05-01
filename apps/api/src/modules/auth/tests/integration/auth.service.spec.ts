import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'bun:test';
import { type TJwtTokens, TUser } from '@diwi/contracts';
import { Test, type TestingModule } from '@nestjs/testing';
import { decode } from 'jsonwebtoken';
import { SurrealDbService } from '~/modules/surrealdb/surrealdb.service';
import { AppModule } from '../../../app/app.module';
import { AuthService } from '../../auth.service';

const user = {
  email: 'test@gmail.com',
  username: 'tester',
  password: 'super-secret-password',
};

describe('Auth Flow', () => {
  let surrealdb: SurrealDbService;
  let authService: AuthService;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    surrealdb = moduleRef.get(SurrealDbService);
    authService = moduleRef.get(AuthService);

    // biome-ignore lint/style/noNonNullAssertion: off
    await surrealdb.connect(process.env.DATABASE_URL!, {
      auth: {
        // biome-ignore lint/style/noNonNullAssertion: off
        username: process.env.SURREALDB_USER!,
        // biome-ignore lint/style/noNonNullAssertion: off
        password: process.env.SURREALDB_PASS!,
      },
      namespace: process.env.SURREALDB_NS,
      database: process.env.SURREALDB_DB,
    });
  });

  afterAll(async () => {
    await surrealdb.delete('user');
    await surrealdb.close();
    await moduleRef.close();
  });

  describe('signup', () => {
    beforeAll(async () => {
      await surrealdb.delete('user');
    });

    it('should signup', async () => {
      const res = await authService.signUp({
        email: user.email,
        username: user.username,
        password: user.password,
      });

      const tokens = res.tokens;

      expect(tokens.accessToken).toBeTruthy();
      expect(tokens.refreshToken).toBeTruthy();
    });

    it('should throw on duplicate user signup', async () => {
      let tokens: TJwtTokens | undefined;
      try {
        const res = await authService.signUp({
          email: user.email,
          username: user.username,
          password: user.password,
        });
        tokens = res.tokens;
        // biome-ignore lint/suspicious/noExplicitAny: tmp fix
      } catch (error: any) {
        expect(error.response.error).toBe('Conflict');
        expect(error.message).toBe('User already exists');
        expect(error.status).toBe(409);
      }

      expect(tokens).toBeUndefined();
    });
  });

  describe('signin', () => {
    beforeAll(async () => {
      await surrealdb.delete('user');
    });

    afterEach(async () => {
      await surrealdb.delete('user');
    });

    beforeEach(async () => {
      await surrealdb.delete('user');
    });

    it('should throw if no existing user', async () => {
      let tokens: TJwtTokens | undefined;

      try {
        const res = await authService.signIn({
          email: user.email,
          password: user.password,
        });
        tokens = res.tokens;
        // biome-ignore lint/suspicious/noExplicitAny: tmp fix
      } catch (error: any) {
        expect(error.status).toBe(403);
      }

      expect(tokens).toBeUndefined();
    });

    it('should login', async () => {
      await authService.signUp({
        email: user.email,
        username: user.username,
        password: user.password,
      });

      const res = await authService.signIn({
        email: user.email,
        password: user.password,
      });
      const tokens = res.tokens;

      expect(tokens.accessToken).toBeTruthy();
      expect(tokens.refreshToken).toBeTruthy();
    });

    it('should throw if password incorrect', async () => {
      let tokens: TJwtTokens | undefined;
      try {
        const res = await authService.signIn({
          email: user.email,
          password: 'dupa',
        });
        tokens = res.tokens;
        // biome-ignore lint/suspicious/noExplicitAny: tmp fix
      } catch (error: any) {
        expect(error.status).toBe(403);
      }

      expect(tokens).toBeUndefined();
    });
  });

  describe('logout', () => {
    beforeAll(async () => {
      await surrealdb.delete('user');
    });

    it('should pass if call to non existent user', async () => {
      const result = await authService.logout('zxczxczxc');
      expect(result).toBeUndefined();
    });

    it('should logout', async () => {
      await authService.signUp({
        email: user.email,
        username: user.username,
        password: user.password,
      });

      let userFromDb: TUser | null;

      userFromDb = (
        await surrealdb.query<TUser[]>(
          `SELECT * FROM ONLY user WHERE email = "${user.email}" LIMIT 1`,
        )
      )[0];

      expect(userFromDb?.refresh_token).toBeTruthy();

      // logout
      await authService.logout(userFromDb?.id.id.toString());

      userFromDb = (
        await surrealdb.query<TUser[]>(
          `SELECT * FROM ONLY user WHERE email = "${user.email}" LIMIT 1`,
        )
      )[0];

      expect(userFromDb?.refresh_token).toBeFalsy();
    });
  });

  describe('refresh', () => {
    beforeAll(async () => {
      await surrealdb.delete('user');
    });

    afterEach(async () => {
      await surrealdb.delete('user');
    });

    it('should throw if no existing user', async () => {
      let tokens: TJwtTokens | undefined;
      try {
        tokens = await authService.refreshTokens('asd', '');
        // biome-ignore lint/suspicious/noExplicitAny: tmp fix
      } catch (error: any) {
        expect(error.status).toBe(403);
      }

      expect(tokens).toBeUndefined();
    });

    it('should throw if user logged out', async () => {
      // signup and save refresh token
      const res = await authService.signUp({
        email: user.email,
        username: user.username,
        password: user.password,
      });
      const _tokens = res.tokens;

      const rt = _tokens.refreshToken;

      // get user id from refresh token
      // also possible to get using surrealdb like above
      // but since we have the rt already, why not just decoding it
      const decoded = decode(rt);
      const userId = decoded?.sub as string;

      // logout the user so the hashedRt is set to null
      await authService.logout(userId);

      let tokens: TJwtTokens | undefined;
      try {
        tokens = await authService.refreshTokens(userId, rt);
        // biome-ignore lint/suspicious/noExplicitAny: tmp fix
      } catch (error: any) {
        expect(error.status).toBe(403);
      }

      expect(tokens).toBeUndefined();
    });

    it('should throw if refresh token incorrect', async () => {
      await surrealdb.delete('user');

      const res = await authService.signUp({
        email: user.email,
        username: user.username,
        password: user.password,
      });
      const _tokens = res.tokens;

      const rt = _tokens.refreshToken;

      const decoded = decode(rt);
      const userId = decoded?.sub as string;

      let tokens: TJwtTokens | undefined;
      try {
        tokens = await authService.refreshTokens(userId, 'wrong-refresh-token');
        // biome-ignore lint/suspicious/noExplicitAny: tmp fix
      } catch (error: any) {
        expect(error.status).toBe(403);
      }

      expect(tokens).toBeUndefined();
    });

    it('should refresh tokens', async () => {
      await authService.signUp({
        email: user.email,
        username: user.username,
        password: user.password,
      });

      // log in the user again and save rt + at
      const res = await authService.signIn({
        email: user.email,
        password: user.password,
      });
      const _tokens = res.tokens;

      const rt = _tokens.refreshToken;
      const at = _tokens.accessToken;

      const decoded = decode(rt);
      const userId = decoded?.sub as string;

      // since jwt uses seconds signature we need to wait for 1 second to have new jwts
      await new Promise((resolve, _reject) => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });

      const tokens = await authService.refreshTokens(userId, rt);
      expect(tokens).toBeDefined();

      // refreshed tokens should be different
      expect(tokens.accessToken).not.toBe(at);
      expect(tokens.refreshToken).not.toBe(rt);
    });
  });
});
