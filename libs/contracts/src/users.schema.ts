import { z } from 'zod';
import { recordIdSchema } from './utils';
import { passwordValidator } from './validators';

// TODO (hub33k): normalize variable names eg. password_hash to passwordHash

export const userSchema = z.object({
  // id: z.string().ulid().min(1),
  id: recordIdSchema,

  email: z.string().email().min(1),
  username: z.string().min(1),
  password_hash: z.string(),

  name: z.string().trim().nullable(),
  refresh_token: z.string().nullable(),

  created_at: z.date(),
  updated_at: z.date(),
});
export type TUser = z.infer<typeof userSchema>;

export const userWithoutSecretsSchema = userSchema
  .merge(
    z.object({
      id: z.string().min(1),
    }),
  )
  .omit({
    password_hash: true,
    refresh_token: true,
  });
export type TUserWithoutSecrets = z.infer<typeof userWithoutSecretsSchema>;

export const createUserSchema = z.object({
  email: z.string().email().min(1),
  username: z.string().min(1),
  password: passwordValidator,
});
export type TCreateUserDto = z.infer<typeof createUserSchema>;

export const updateUserSchema = userSchema
  .omit({
    id: true,
    email: true,
    username: true,
    created_at: true,
    updated_at: true,
  })
  .partial();
export type TUpdateUserDto = z.infer<typeof updateUserSchema>;
