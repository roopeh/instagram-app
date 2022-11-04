import { CookieOptions } from "express";
import { Cookies, Tokens } from "../types";

const setTokenCookies = (tokens: Tokens): Cookies => {
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    // SameSite: None,
  };

  return {
    access: [
      "access", tokens.accessToken, cookieOptions,
    ],
    refresh: [
      "refresh", tokens.refreshToken, cookieOptions,
    ],
  };
};

export default setTokenCookies;
