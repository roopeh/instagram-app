import { Types } from "mongoose";

export interface IComment {
  author: Types.ObjectId,
  date: string,
  message: string
}

export interface IPhoto {
  imageString: string,
  publishDate: string,
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
  followers: Array<Types.ObjectId>
}

export type UserRegisterInput = {
  username: string,
  password: string,
  firstName: string,
  lastName: string
}

export type UserLoginInput = Omit<UserRegisterInput, "firstName" | "lastName">;
