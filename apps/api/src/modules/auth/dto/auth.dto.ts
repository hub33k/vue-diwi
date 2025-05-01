import { signInUserSchema, signUpUserSchema } from '@diwi/contracts';
import { createZodDto } from 'nestjs-zod';

export class SignUpUserDto extends createZodDto(signUpUserSchema) {}
export class SignInUserDto extends createZodDto(signInUserSchema) {}
