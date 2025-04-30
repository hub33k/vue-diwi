import { Controller, Get, Version } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Version('1')
  @Get('/users')
  public getAllUsers() {
    return this.appService.getAllUsers();
  }

  @Version('1')
  @Get()
  public getHello(): string {
    return this.appService.getHello();
  }
}
