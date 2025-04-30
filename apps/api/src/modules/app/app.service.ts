import { TUser } from '@diwi/contracts';
import { Injectable } from '@nestjs/common';
import { SurrealDbService } from '~/modules/surrealdb/surrealdb.service';

@Injectable()
export class AppService {
  constructor(private readonly db: SurrealDbService) {}

  public async getAllUsers() {
    const usersQuery = await this.db.query<TUser[][]>(
      'SELECT * FROM user ORDER BY username ASC;',
    );
    const users = usersQuery[0];
    return users;
  }

  public getHello(): string {
    return 'Hello World!';
  }
}
