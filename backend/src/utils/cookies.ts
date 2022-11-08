import { CookieOptions } from "express";
import { Cookies, Tokens } from "../types";

const setTokenCookies = (tokens: Tokens): Cookies => {
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
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
