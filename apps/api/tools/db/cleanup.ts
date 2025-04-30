// Cleanup database

import Surreal from 'surrealdb';
import { setupDb } from './utils';

const namespace = process.env.SURREALDB_NS;
const database = process.env.SURREALDB_DB;

let db: Surreal;

async function cleanup() {
  db = await setupDb();
  await db.use({ namespace, database });

  const dbInfo = await db.query<{ tables: string[] }[]>('INFO FOR DB');
  const tables = Object.keys(dbInfo[0].tables);

  for (const table of tables) {
    console.log(`Removing table: ${table}`);
    await db.query(`REMOVE TABLE IF EXISTS ${table}`);
  }
}

cleanup().finally(async () => {
  await db.close();
});
