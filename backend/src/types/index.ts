import { CookieOptions } from "express";
import { Types } from "mongoose";

export interface IComment {
  author: Types.ObjectId,
  date: string,
  message: string
}

export interface IPhoto {
  imageString: string,
  publishDate: string,
  captionText: string,
  likes: Array<Types.ObjectId>,
  comments: Array<Types.ObjectId>
}

export interface IUser {
  username: string,
  password: string,
  firstName: string,
  lastName: string,
  bioText: string,
  lastOnline: string,
  profilePhoto: Types.ObjectId,
  coverPhoto: Types.ObjectId,
  photos: Array<Types.ObjectId>,
  following: Array<Types.ObjectId>,
  followers: Array<Types.ObjectId>,
  messages: Array<Types.ObjectId>
}

export interface DbUser extends IUser {
  encryptPassword: () => Promise<void>,
  isValidPassword: (password: string) => Promise<boolean>,
}

export type Cookies = {
  access: [
    type: string,
    token: string,
    options: CookieOptions,
  ],
  refresh: [
    type: string,
    token: string,
    options: CookieOptions,
  ]
};

export type Tokens = {
  accessToken: string,
  refreshToken: string
};

export type UserRegisterInput = {
  username: string,
  password: string,
  firstName: string,
  lastName: string
};

export type UserLoginInput = Omit<UserRegisterInput, "firstName" | "lastName">;

export type UserInput = {
  username: string,
};

export type NameInput = {
  firstName: string,
  lastName: string,
};

export type BioTextInput = {
  bioText: string,
};

export type PictureInput = {
  type: string,
  captionText: string,
  size: number,
  base64: string,
};
