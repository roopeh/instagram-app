/* eslint-disable no-underscore-dangle */
import { Request, Response, NextFunction } from "express";
import {
  validateAccessToken, validateRefreshToken, AccessToken, RefreshToken, setTokens,
} from "../tokens";
import User from "../../models/User";
import setTokenCookies from "../cookies";
import { logInfo } from "../logger";

interface UserRequest extends Request {
  user?: {
    id: string,
    username?: string
  }
}

const tokenValidation = async (req: UserRequest, res: Response, next: NextFunction) => {
  const logCookies: boolean = false;

  const accessToken = req.cookies.access;
  const refreshToken = req.cookies.refresh;
  // No tokens
  if (!accessToken && !refreshToken) {
    if (logCookies) logInfo("no tokens");
    return next();
  }

  const decodedAccessToken = validateAccessToken(accessToken as string);
  // Check if access token exists and is valid
  if (decodedAccessToken && (decodedAccessToken as AccessToken).user) {
    if (logCookies) logInfo("valid access token");
    req.user = (decodedAccessToken as AccessToken).user;
    return next();
  }

  // Access token does not exist or it is expired, check for refresh token
  const decodedRefreshToken = validateRefreshToken(refreshToken as string);
  if (decodedRefreshToken && (decodedRefreshToken as RefreshToken).user) {
    const user = await User.findById((decodedRefreshToken as RefreshToken).user.id);
    if (!user || user.username !== (decodedRefreshToken as RefreshToken).user.username) {
      // User does not exist or username is not correct
      if (logCookies) logInfo("invalid refresh token");
      res.clearCookie("access");
      res.clearCookie("refresh");
      return next();
    }

    if (logCookies) logInfo("new access and refresh token");

    req.user = (decodedRefreshToken as RefreshToken).user;
    // Generate new tokens for user
    const tokens = setTokens({ id: user._id.toString(), user });
    const cookies = setTokenCookies(tokens);
    res.cookie(...cookies.access);
    res.cookie(...cookies.refresh);
    return next();
  }

  if (logCookies) logInfo("invalid cookies and tokens");

  // Tokens are invalid
  return next();
};

export default tokenValidation;
