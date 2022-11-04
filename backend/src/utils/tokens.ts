import jwt from "jsonwebtoken";
import { DbUser, Tokens } from "../types";

export interface AccessToken {
  user: {
    id: string
  }
}

export interface RefreshToken {
  user: {
    id: string,
    username: string
  }
}

interface SetTokenProps {
  id: string,
  user: DbUser
}

export const setTokens = ({ id, user }: SetTokenProps): Tokens => {
  // 5 minutes
  // const accessExpiryTime: number = 60 * 5 * 1000;
  // TEST 10 seconds
  const accessExpiryTime = 10;
  // 5 days
  // const refreshExpiryTime: number = 60 * 60 * 24 * 5 * 1000;
  // TEST 15 seconds
  const refreshExpiryTime = 15;

  const accessUser: AccessToken = {
    user: {
      id,
    },
  };
  const accessToken = jwt.sign(
    accessUser,
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: accessExpiryTime },
  );

  const refreshUser: RefreshToken = {
    user: {
      id,
      username: user.username,
    },
  };
  const refreshToken = jwt.sign(
    refreshUser,
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: refreshExpiryTime },
  );

  return { accessToken, refreshToken };
};

export const validateAccessToken = (token: string): string | jwt.JwtPayload | null => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
  } catch {
    return null;
  }
};

export const validateRefreshToken = (token: string): string | jwt.JwtPayload | null => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);
  } catch {
    return null;
  }
};
