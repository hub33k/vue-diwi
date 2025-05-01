import { type IJwtPayload, type TJwtTokens } from '@diwi/contracts';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UsePipes,
  Version,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { UsersService } from '~/modules/users/users.service';
import { stripUserFromSecrets } from '~/utils';
import { AuthService } from './auth.service';
import { GetCurrentUserId } from './decorators/get-current-user-id.decorator';
import { GetCurrentUser } from './decorators/get-current-user.decorator';
import { Public } from './decorators/public.decorator';
import { SignInUserDto, SignUpUserDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Version('1')
  @Post('signup')
  @Public()
  @UsePipes(ZodValidationPipe)
  public async signUp(@Body() signUpUserDto: SignUpUserDto) {
    return this.authService.signUp(signUpUserDto);
  }

  @Version('1')
  @Post('signin')
  @Public()
  @UseGuards(LocalAuthGuard)
  @UsePipes(ZodValidationPipe) // TODO (hub33k): zod validation pipe not working?
  public async signIn(@Body() signInUserDto: SignInUserDto) {
    return this.authService.signIn(signInUserDto);
  }

  @Version('1')
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  public async logout(@GetCurrentUserId() id: string) {
    return this.authService.logout(id);
  }

  @Version('1')
  @Post('refresh')
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  public async refreshToken(
    @GetCurrentUserId() id: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<TJwtTokens> {
    return this.authService.refreshTokens(id, refreshToken);
  }

  @Version('1')
  @Get('me')
  @UseGuards(JwtAuthGuard)
  public async me(@Request() req: { user: IJwtPayload }) {
    // TODO (hub33k): temp; fix later
    // return req.user;
    const user = await this.usersService.findOne(req.user.sub);
    if (!user) {
      return null;
    }
    return stripUserFromSecrets(user);
  }
}
