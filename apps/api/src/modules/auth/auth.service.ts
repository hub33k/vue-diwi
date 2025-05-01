import {
  type TJwtPayloadData,
  type TJwtTokens,
  type TJwtUserData,
  type TUserWithoutSecrets,
} from '@diwi/contracts';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SurrealDbService } from '~/modules/surrealdb/surrealdb.service';
import { UsersService } from '~/modules/users/users.service';
import { stripUserFromSecrets } from '~/utils';
import { BaseConfig } from '../app-config/base-config.service';
import { type SignInUserDto, type SignUpUserDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly baseConfig: BaseConfig,
    private readonly db: SurrealDbService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register new user
   */
  public async signUp(signUpUserDto: SignUpUserDto) {
    const user = await this.usersService.findOne(
      undefined,
      `WHERE email = "${signUpUserDto.email}" OR username = "${signUpUserDto.username}"`,
    );

    if (user) {
      throw new ConflictException('User already exists');
    }

    const newUser = await this.usersService.create({
      email: signUpUserDto.email,
      username: signUpUserDto.username,
      password: signUpUserDto.password,
    });

    const tokens = await this.getTokens({
      id: newUser.id.id.toString(),
      email: newUser.email,
    });
    await this.updateRefreshToken(
      newUser.id.id.toString(),
      tokens.refreshToken,
    );

    return {
      user: stripUserFromSecrets(newUser),
      tokens,
    };
  }

  /**
   * Login user
   */
  public async signIn(signInUserDto: SignInUserDto) {
    const user = await this.usersService.findOne(
      undefined,
      `WHERE email = "${signInUserDto.email}"`,
    );

    if (!user) {
      throw new ForbiddenException('Access Denied');
    }
    const tokens = await this.getTokens({
      id: user.id.id.toString(),
      email: user.email,
    });
    await this.updateRefreshToken(user.id.id.toString(), tokens.refreshToken);

    return {
      user: stripUserFromSecrets(user),
      tokens,
    };
  }

  public async logout(id: string) {
    await this.db.query(`UPDATE user:${id} SET refresh_token = NONE`);
  }

  public async refreshTokens(id: string, refreshToken: string) {
    const user = await this.usersService.findOne(id);

    if (!user || !user.refresh_token) {
      throw new ForbiddenException('Access Denied');
    }

    const isRefreshTokenMatches = await Bun.password.verify(
      refreshToken,
      user.refresh_token,
    );
    if (!isRefreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.getTokens({
      id: user.id.id.toString(),
      email: user.email,
    });
    this.updateRefreshToken(user.id.id.toString(), tokens.refreshToken);

    return tokens;
  }

  /**
   * Check if user can sign in (has correct login credentials)
   */
  public async validateUser(
    signInUserDto: SignInUserDto,
  ): Promise<TUserWithoutSecrets | null> {
    const user = await this.usersService.findOne(
      undefined,
      `WHERE email = "${signInUserDto.email}"`,
    );

    if (
      user &&
      (await Bun.password.verify(signInUserDto.password, user.password_hash))
    ) {
      return stripUserFromSecrets(user);
    }

    return null;
  }

  // ================================================================

  private async updateRefreshToken(id: string, refreshToken: string) {
    const hashedRefreshToken = await Bun.password.hash(refreshToken);
    await this.usersService.update(id, {
      refresh_token: hashedRefreshToken,
    });
  }

  private async getTokens(jwtUserData: TJwtUserData): Promise<TJwtTokens> {
    const payload: TJwtPayloadData = {
      email: jwtUserData.email,
      sub: jwtUserData.id,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: this.baseConfig.jwtSecretKey,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: this.baseConfig.jwtRefreshSecretKey,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
