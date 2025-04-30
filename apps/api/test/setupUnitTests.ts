import { afterAll, beforeAll } from 'bun:test';

beforeAll(async () => {
  // global setup

  console.log('Starting unit tests');
  console.log('DATABASE_URL', process.env.DATABASE_URL);
  console.log('NAMESPACE', process.env.SURREALDB_NS);
  console.log('DATABASE', process.env.SURREALDB_DB);
});

afterAll(async () => {
  // global teardown
});
