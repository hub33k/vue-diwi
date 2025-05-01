import { Controller, Get, Version } from '@nestjs/common';
import { Public } from '~/modules/auth/decorators/public.decorator';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Version('1')
  @Public()
  @Get('/users')
  public getAllUsers() {
    return this.appService.getAllUsers();
  }

  @Version('1')
  @Public()
  @Get()
  public getHello(): string {
    return this.appService.getHello();
  }
}
