import { sign } from "jsonwebtoken"
import { User } from './entities/user.entity';


// TODO: Add secret key
export const createAccessToken = (user: User) => {
  return sign(
    {
      id: user.id,
      email: user.email,
    },
    'wadadawdawfawf',
    { expiresIn: '15m' },
  );
};

// TODO: Add different secret key
export const createRefreshToken = (user: User) => {
  return sign(
    {
      id: user.id,
      email: user.email,
    },
    'awdawfwagagawgawkalgwjalkwjjk',
    { expiresIn: '14d' },
  );
};