import { TUser } from '@diwi/contracts';
import Surreal from 'surrealdb';
import { setupDb } from './utils';

const namespace = process.env.SURREALDB_NS;
const database = process.env.SURREALDB_DB;

let db: Surreal;

async function seed() {
  console.log('Seeding database...');

  db = await setupDb();
  await db.use({ namespace, database });

  for (let i = 0; i < 10; i++) {
    if (await isUserExists(`test${i}@test.com`)) {
      console.log('User already exists:', `test${i}@test.com`);
      continue;
    }
    await createUser(
      `username = "Bob ${i}", email = "test${i}@test.com", password_hash = "${await Bun.password.hash('root')}";`,
    );
  }
}

seed().finally(async () => {
  await db.close();
});

// Helpers
// ================================================================

async function createUser(props: string) {
  try {
    const userQuery = await db.query<TUser[][]>(`CREATE user SET ${props};`);
    const user = userQuery[0][0];
    const id = user.id;
    console.log('User created:', id.id);
    return user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
  }
}

async function isUserExists(email: string) {
  try {
    const user = await db.query<TUser[][]>(
      `SELECT * FROM user WHERE email = "${email}"`,
    );
    if (user.length === 1 && user[0].length === 0) {
      return false;
    }

    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
  }
}
