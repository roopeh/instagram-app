import { CookieOptions } from "express";
import { Types } from "mongoose";

export interface IComment {
  author: Types.ObjectId,
  photo: Types.ObjectId,
  date: number,
  message: string
}

export interface IPhotoLike {
  user: Types.ObjectId,
  photo: Types.ObjectId,
  likeDate: number,
}

export interface IPhoto {
  imageString: string,
  author: Types.ObjectId,
  publishDate: number,
  captionText: string,
  isFeedPhoto: boolean,
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

export interface IMessage {
  sender: Types.ObjectId,
  conversation: Types.ObjectId,
  date: number,
  message: string,
  usersUnread: Array<Types.ObjectId>,
}

export interface IConversation {
  participiants: Array<Types.ObjectId>,
  messages: Array<Types.ObjectId>,
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

export type UserQueryInput = {
  username: string,
  firstName: string,
  lastName: string,
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

export type PictureQueryInput = {
  username: string,
  photoId: string,
};

export type PictureIdInput = {
  photoId: string,
};

export type CommentInput = {
  photoId: string,
  message: string,
};

export type FollowInput = {
  userId: string,
};

export type ConversationInput = {
  receivers: Array<string>;
};

export type ConversationQueryInput = {
  conversationId: string,
};

export type MessageInput = {
  conversation: string,
  message: string,
};

export type TypingInput = {
  conversationId: string,
};

export type MessageSubscription = {
  newMessage: {
    conversation: IConversation,
    message: IMessage,
  }
};
export type MessageSubscriptionInput = { userId: string };

export type TypingSubscription = {
  userTyping: {
    conversationId: string,
    user: IUser,
  }
};
export type TypingSubscriptionInput = { conversationId: string };
