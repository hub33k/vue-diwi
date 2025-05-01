import {
  TUpdateUserDto,
  type TUser,
  type TUserWithoutSecrets,
} from '@diwi/contracts';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RecordId } from 'surrealdb';
import { SurrealDbService } from '~/modules/surrealdb/surrealdb.service';
import { stripUserFromSecrets } from '~/utils';
import { type CreateUserDto, type UpdateUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly surrealdb: SurrealDbService) {}

  public async findOne(id?: string, where = ''): Promise<TUser | null> {
    try {
      const userQuery = await this.surrealdb.query<TUser[]>(
        `SELECT * FROM ONLY user${id ? `:${id}` : ''} ${where} LIMIT 1`,
      );
      const user = userQuery[0];
      if (!user) {
        return null;
      }
      return user;
    } catch (error: unknown) {
      console.error(error);
      throw new Error('An unexpected error occurred, please try again later.');
    }
  }

  public async findOneById(id: string): Promise<TUser> {
    try {
      const userQuery = await this.surrealdb.query<TUser[]>(
        `SELECT * FROM ONLY user:${id} LIMIT 1`,
      );
      const user = userQuery[0];
      if (!user) {
        throw new NotFoundException();
      }
      return user;
    } catch (error: unknown) {
      console.error(error);
      throw new Error('An unexpected error occurred, please try again later.');
    }
  }

  public async create(createUserDto: CreateUserDto): Promise<TUser> {
    const user = await this.findOne(
      undefined,
      `WHERE email = "${createUserDto.email}" OR username = "${createUserDto.username}"`,
    );

    if (user) {
      throw new ConflictException('User already exists');
    }

    const { password, ...rest } = createUserDto;
    const newUserQuery = await this.surrealdb.create<
      TUser,
      {
        username: string;
        email: string;
        password_hash: string;
      }
    >('user', {
      ...rest,
      password_hash: await Bun.password.hash(password),
    });
    const newUser = newUserQuery[0];

    return newUser;
  }

  public async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<TUserWithoutSecrets> {
    // TODO (hub33k): hash password if it was changed
    // if (updateUserDto.password) {
    //   updateUserDto.password_hash = await Bun.password.hash(
    //     updateUserDto.password,
    //   );
    // }
    const userQuery = await this.surrealdb.merge<TUser, TUpdateUserDto>(
      new RecordId('user', id),
      {
        ...updateUserDto,
      },
    );
    const user = userQuery;

    return stripUserFromSecrets(user);
  }
}
