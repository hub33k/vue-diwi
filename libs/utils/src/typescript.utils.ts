/**
 * Utility type that ensures at least one key is required.
 *
 * Usage:
 * ```
 * type UserQueryOptions = {
 *   id?: string;
 *   email?: string;
 *   username?: string;
 * };
 *
 * type RequiredUserQueryOptions = AtLeastOne<UserQueryOptions>;
 * ```
 */
export type AtLeastOne<T> = {
  [K in keyof T]: Pick<T, K>;
}[keyof T];
