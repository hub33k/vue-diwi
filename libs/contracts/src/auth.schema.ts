import z from 'zod';
import { createUserSchema } from './users.schema';

export const signInUserSchema = z.object({
  email: createUserSchema.shape.email,
  password: createUserSchema.shape.password,
});
export type TSignIn = z.infer<typeof signInUserSchema>;

export const signUpUserSchema = createUserSchema;
export type TSignUp = z.infer<typeof signUpUserSchema>;

// ================================================================

export const jwtPayloadSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
});
export type TJwtPayload = z.infer<typeof jwtPayloadSchema>;

export type TJwtPayloadData = {
  email: string;
  /**
   * SUBject (User ID)
   *
   * Subject of the JWT (the user)
   */
  sub: string;
};

export type TJwtUserData = {
  id: string;
  email: string;
};

// https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-claims#registered-claims
export interface IJwtPayload extends TJwtPayloadData {
  /**
   * Issued At Time
   *
   * Time at which the JWT was issued; can be used to determine age of the JWT
   */
  iat: number;
  /**
   * EXPiration time
   *
   * Time after which the JWT expires
   */
  exp?: number;
}

export type TJwtPayloadWithRefreshToken = IJwtPayload & {
  refreshToken: string;
};

export type TJwtTokens = {
  accessToken: string;
  refreshToken: string;
};
