import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  Version,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { Public } from '../auth/decorators/public.decorator';
import { CreateUserDto } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('users')
@UsePipes(ZodValidationPipe)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Version('1')
  @Get(':id')
  public async getOne(@Param() id: string) {
    console.log('id', id);
    return this.usersService.findOne(id);
  }

  @Version('1')
  @Post()
  @Public()
  public async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
