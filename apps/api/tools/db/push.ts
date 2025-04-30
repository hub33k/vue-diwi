// Read schema.surql and push it to the database

import fs from 'node:fs/promises';
import path from 'node:path';
import Surreal from 'surrealdb';
import { setupDb } from './utils';

const namespace = process.env.SURREALDB_NS;
const database = process.env.SURREALDB_DB;

let db: Surreal;

async function push() {
  db = await setupDb();

  // Setup namespace and databases
  await db.query(`DEFINE NAMESPACE IF NOT EXISTS ${namespace};`);
  await db.use({ namespace: namespace, database: database });
  await db.query(`DEFINE DATABASE IF NOT EXISTS ${database};`);
  await db.query(`DEFINE DATABASE IF NOT EXISTS ${database}_test;`);

  const schemaStr = await loadSchema();
  if (schemaStr) {
    console.log('Pushing schema...');
    await db.query(schemaStr);
  } else {
    console.log('No schema found');
  }
}

push().finally(async () => {
  await db.close();
});

// Helpers
// ================================================================

// https://nodejs.org/en/learn/manipulating-files/reading-files-with-nodejs
async function loadSchema(file = '../../src/modules/surrealdb/schema.surql') {
  try {
    const schemaPath = path.resolve(__dirname, file);
    const data = fs.readFile(schemaPath, { encoding: 'utf-8' });
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
