import { type TUser, TUserWithoutSecrets } from '@diwi/contracts';

export const stripUserFromSecrets = (user: TUser): TUserWithoutSecrets => {
  const { refresh_token, password_hash, ...resultUser } = user;

  return {
    ...resultUser,
    id: user.id.id.toString(),
  };
};
