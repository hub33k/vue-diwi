import type { QueryResult, RecordId } from 'surrealdb';
import { z } from 'zod';

// SurrealDB types
export const recordIdSchema = z.custom<RecordId>();
export type TRecordId = z.infer<typeof recordIdSchema>;
export type TQueryResult<T> = QueryResult<T>;
