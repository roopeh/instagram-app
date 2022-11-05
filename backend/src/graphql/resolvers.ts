import { ApolloError, UserInputError } from "apollo-server";
import { mongo, Error } from "mongoose";
import User from "../models/User";
import {
  IUser, UserLoginInput, UserRegisterInput,
} from "../types";
import setTokenCookies from "../utils/cookies";
import { logError } from "../utils/logger";
import { setTokens } from "../utils/tokens";

const resolvers = {
  User: {
    photoCount: (root: IUser): number => root.photos.length,
    followingCount: (root: IUser): number => root.following.length,
    followersCount: (root: IUser): number => root.followers.length,
  },
  Query: {
    userCount: async (): Promise<number> => User.collection.countDocuments(),
    allUsers: async (): Promise<Array<IUser>> => User.find({}),
    me: async (_root: any, _args: any, context: any): Promise<IUser | null> => {
      if (!context.req.user) {
        return null;
      }

      const user = await User.findById(context.req.user.id);
      return user;
    },
  },
  Mutation: {
    createUser: async (_root: any, args: { input: UserRegisterInput }): Promise<IUser> => {
      // Check if username already exists
      const existingUsername = await User.findOne({ username: args.input.username.toLowerCase() });
      if (existingUsername) {
        throw new UserInputError("Username already exists");
      }

      // Check password length
      if (args.input.password.length < 5) {
        throw new UserInputError("Password must be at least 5 characters long");
      }

      // Check name fields
      if (!args.input.firstName.match(/^[A-Za-z\s]*$/)) {
        throw new UserInputError("First name must contain only letters");
      }
      if (!args.input.lastName.match(/^[A-Za-z\s]*$/)) {
        throw new UserInputError("Last name must contain only letters");
      }

      // Format fields
      const formattedInputs: UserRegisterInput = {
        username: args.input.username.toLowerCase(),
        password: args.input.password,
        firstName: args.input.firstName.charAt(0).toUpperCase()
          + args.input.firstName.slice(1).toLowerCase(),
        lastName: args.input.lastName.charAt(0).toUpperCase()
          + args.input.lastName.slice(1).toLowerCase(),
      };

      const user = new User(formattedInputs);
      await user.encryptPassword();

      try {
        await user.save();
      } catch (error) {
        if (error instanceof Error.ValidationError
        && Object.values(error.errors).length > 0) {
          // Send only the first error
          const firstError = Object.values(error.errors)[0];
          throw new UserInputError(firstError.message);
        } else if (error instanceof mongo.MongoError || error instanceof Error) {
          throw new UserInputError(error.message, { invalidArgs: args });
        } else {
          logError(error);
          throw new ApolloError("Unknown server error");
        }
      }
      return user;
    },
    login: async (_root: any, args: { input: UserLoginInput }, context: any): Promise<IUser> => {
      const user = await User.findOne({ username: args.input.username.toLowerCase() });
      if (!user) {
        throw new UserInputError("Invalid username or password");
      }

      try {
        const passwordMatches = await user.isValidPassword(args.input.password);
        if (!passwordMatches) {
          throw new UserInputError("Invalid username or password");
        }

        // eslint-disable-next-line no-underscore-dangle
        const tokens = setTokens({ id: user._id.toString(), user });
        const cookies = setTokenCookies(tokens);
        context.res.cookie(...cookies.access);
        context.res.cookie(...cookies.refresh);
        return user;
      } catch (error) {
        if (error instanceof Error.ValidationError
        && Object.values(error.errors).length > 0) {
          // Send only the first error
          const firstError = Object.values(error.errors)[0];
          throw new UserInputError(firstError.message);
        } else if (error instanceof mongo.MongoError || error instanceof Error) {
          throw new UserInputError(error.message, { invalidArgs: args });
        } else {
          logError(error);
          throw new ApolloError("Unknown server error");
        }
      }
    },
    logout: async (_root: any, _args: any, context: any): Promise<boolean> => {
      context.res.clearCookie("access");
      context.res.clearCookie("refresh");
      return true;
    },
  },
};

export default resolvers;
