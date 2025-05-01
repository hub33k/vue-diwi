// TODO (hub33k): add surrealdb and generate types from db (json)?
//   or create database/db package

import { z } from 'zod';

export * from './auth.schema';
export * from './utils';
export * from './users.schema';
export * from './validators';

export const noteSchema = z.object({
  id: z.string().ulid().min(1),
  userId: z.string().ulid(),

  title: z.string().min(1),
  content: z.string().min(1),
  tags: z.array(z.string()).default([]),

  createdAt: z.date(),
  updatedAt: z.date(),
});
export type TNote = z.infer<typeof noteSchema>;

export const createNoteSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  tags: z.array(z.string()).default([]),
});
export type TCreateNoteDto = z.infer<typeof createNoteSchema>;
