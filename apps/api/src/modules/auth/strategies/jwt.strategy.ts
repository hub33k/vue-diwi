import { type IJwtPayload } from '@diwi/contracts';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '~/modules/users/users.service';
import { BaseConfig } from '../../app-config/base-config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly baseConfig: BaseConfig,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: baseConfig.jwtSecretKey,
    });
  }

  public async validate(payload: IJwtPayload): Promise<IJwtPayload | null> {
    const user = await this.usersService.findOne(payload.sub);

    if (!user) {
      return null;
    }

    // NOTE (hub33k): this is passed to req.user
    return payload;
  }
}
