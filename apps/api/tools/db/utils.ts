import Surreal from 'surrealdb';

export async function setupDb() {
  const db = new Surreal();

  // biome-ignore lint/style/noNonNullAssertion: off
  await db.connect(process.env.DATABASE_URL!, {
    auth: {
      // biome-ignore lint/style/noNonNullAssertion: off
      username: process.env.SURREALDB_USER!,
      // biome-ignore lint/style/noNonNullAssertion: off
      password: process.env.SURREALDB_PASS!,
    },
  });

  return db;
}
