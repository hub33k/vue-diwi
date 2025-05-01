import {
  type IJwtPayload,
  type TJwtPayloadWithRefreshToken,
} from '@diwi/contracts';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { type Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '~/modules/users/users.service';
import { BaseConfig } from '../../app-config/base-config.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly baseConfig: BaseConfig,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: baseConfig.jwtRefreshSecretKey,
      passReqToCallback: true,
    });
  }

  public async validate(
    req: Request,
    payload: IJwtPayload,
  ): Promise<TJwtPayloadWithRefreshToken | null> {
    const refreshToken = req
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();

    if (!refreshToken) {
      throw new ForbiddenException('Refresh token malformed');
    }

    const user = await this.usersService.findOne(payload.sub);

    if (!user) {
      return null;
    }

    // NOTE (hub33k): this is passed to req.user
    return {
      ...payload,
      refreshToken,
    };
  }
}
