import { ApolloError, UserInputError } from "apollo-server";
import { mongo, Error } from "mongoose";
import User from "../models/User";
import { IUser, UserRegisterInput } from "../types";
import { logError } from "../utils/logger";

const resolvers = {
  User: {
    photoCount: (root: IUser): number => root.photos.length,
    followingCount: (root: IUser): number => root.following.length,
    followersCount: (root: IUser): number => root.followers.length,
  },
  Query: {
    userCount: async (): Promise<number> => User.collection.countDocuments(),
    allUsers: async (): Promise<Array<IUser>> => User.find({}),
  },
  Mutation: {
    createUser: async (_root: any, args: { input: UserRegisterInput }): Promise<IUser> => {
      // Check if username already exists
      const existingUsername = await User.findOne({ username: args.input.username });
      if (existingUsername) {
        throw new UserInputError("Username already exists");
      }

      // Check password length
      if (args.input.password.length < 5) {
        throw new UserInputError("Password must be at least 5 characters long");
      }

      const user = new User(args.input);
      await user.encryptPassword();

      try {
        await user.save();
      } catch (error) {
        if (error instanceof Error.ValidationError
        && Object.values(error.errors).length > 0) {
          // Send only the first error
          const firstError = Object.values(error.errors)[0];
          throw new UserInputError(firstError.message);
        } else if (error instanceof mongo.MongoError) {
          throw new UserInputError(error.message, { invalidArgs: args });
        } else if (error instanceof Error) {
          throw new ApolloError(error.message);
        } else {
          logError(error);
          throw new ApolloError("Unknown server error");
        }
      }
      return user;
    },
  },
};

export default resolvers;
