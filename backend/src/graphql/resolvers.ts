/* eslint-disable no-underscore-dangle */
import { ApolloError, AuthenticationError, UserInputError } from "apollo-server";
import { mongo, Error } from "mongoose";
import Photo from "../models/Photo";
import User from "../models/User";
import {
  BioTextInput,
  IPhoto,
  IUser, NameInput, PictureInput, UserInput, UserLoginInput, UserRegisterInput,
} from "../types";
import setTokenCookies from "../utils/cookies";
import { logError } from "../utils/logger";
import { setTokens } from "../utils/tokens";

const handleCatchError = (error: unknown, args: any) => {
  if (error instanceof Error.ValidationError
  && Object.values(error.errors).length > 0) {
    // Send only the first error
    const firstError = Object.values(error.errors)[0];
    throw new UserInputError(firstError.message);
  } else if (error instanceof UserInputError) {
    throw new UserInputError(error.message);
  } else if (error instanceof mongo.MongoError || error instanceof Error) {
    throw new UserInputError(error.message, { invalidArgs: args });
  } else {
    logError(error);
    throw new ApolloError("Unknown server error");
  }
};

// eslint-disable-next-line arrow-body-style
const firstCharUpperRestLower = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const findUser = async (variables: any) => User
  .findOne(variables)
  .populate(["profilePhoto", "coverPhoto", "photos", "following",
    "followers"/* , "messages" */]);

const resolvers = {
  Photo: {
    likesCount: (root: IPhoto): number => root.likes.length,
    commentsCount: (root: IPhoto): number => root.comments.length,
  },
  User: {
    photoCount: (root: IUser): number => root.photos.length,
    followingCount: (root: IUser): number => root.following.length,
    followersCount: (root: IUser): number => root.followers.length,
  },
  Query: {
    userCount: async (): Promise<number> => User.collection.countDocuments(),
    getUser: async (_root: any, args: { input: UserInput }): Promise<IUser | null> => {
      const user = await findUser({ username: args.input.username.toLowerCase() });
      return user;
    },
    allUsers: async (): Promise<Array<IUser>> => User.find({}),
    me: async (_root: any, _args: any, context: any): Promise<IUser | null> => {
      if (!context.req.user) {
        return null;
      }

      const user = await findUser({ _id: context.req.user.id });
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
        firstName: firstCharUpperRestLower(args.input.firstName),
        lastName: firstCharUpperRestLower(args.input.lastName),
      };

      const user = new User(formattedInputs);

      try {
        await user.encryptPassword();
        await user.save();
      } catch (error) {
        return handleCatchError(error, args);
      }
      return user;
    },
    login: async (_root: any, args: { input: UserLoginInput }, context: any): Promise<IUser> => {
      const user = await findUser({ username: args.input.username.toLowerCase() });
      if (!user) {
        throw new UserInputError("Invalid username or password");
      }

      try {
        const passwordMatches = await user.isValidPassword(args.input.password);
        if (!passwordMatches) {
          throw new UserInputError("Invalid username or password");
        }

        const tokens = setTokens({ id: user._id.toString(), user });
        const cookies = setTokenCookies(tokens);
        context.res.cookie(...cookies.access);
        context.res.cookie(...cookies.refresh);
        return user;
      } catch (error) {
        return handleCatchError(error, args);
      }
    },
    logout: async (_root: any, _args: any, context: any): Promise<boolean> => {
      context.res.clearCookie("access");
      context.res.clearCookie("refresh");
      return true;
    },
    setNames:
    async (_root: any, args: { input: NameInput }, context: any): Promise<IUser> => {
      if (!context.req.user) {
        throw new AuthenticationError("You must be logged in");
      }

      const user = await User.findById(context.req.user.id);
      if (!user) {
        throw new AuthenticationError("You must be logged in");
      }

      // Check name fields
      if (!args.input.firstName.match(/^[A-Za-z\s]*$/)) {
        throw new UserInputError("First name must contain only letters");
      }
      if (!args.input.lastName.match(/^[A-Za-z\s]*$/)) {
        throw new UserInputError("Last name must contain only letters");
      }

      user.firstName = firstCharUpperRestLower(args.input.firstName);
      user.lastName = firstCharUpperRestLower(args.input.lastName);

      try {
        await user.save();
      } catch (err) {
        return handleCatchError(err, args);
      }

      return user;
    },
    setBioText:
    async (_root: any, args: { input: BioTextInput }, context: any): Promise<IUser> => {
      if (!context.req.user) {
        throw new AuthenticationError("You must be logged in");
      }

      const user = await User.findById(context.req.user.id);
      if (!user) {
        throw new AuthenticationError("You must be logged in");
      }

      user.bioText = args.input.bioText;

      try {
        await user.save();
      } catch (err) {
        return handleCatchError(err, args);
      }

      return user;
    },
    setProfilePicture:
    async (_root: any, args: { input: PictureInput }, context: any): Promise<IPhoto | null> => {
      if (!context.req.user) {
        throw new AuthenticationError("You must be logged in");
      }

      const user = await User.findById(context.req.user.id);
      if (!user) {
        throw new AuthenticationError("You must be logged in");
      }

      const fileType = args.input.type.toLowerCase().split("/");
      if (fileType[0] !== "image") {
        throw new UserInputError("File must be an image file");
      }

      if (args.input.size > (5 * 1024 * 1024)) {
        throw new UserInputError("Image must be less than 5 MB");
      }

      // Delete existing profile photo
      if (user.profilePhoto) {
        try {
          await Photo.findByIdAndDelete(user.profilePhoto);
        } catch (err) {
          logError(err);
        }
      }

      const profilePicture = new Photo({
        imageString: args.input.base64,
        publishDate: Date.now() / 1000,
      });

      try {
        await profilePicture.save();
        user.profilePhoto = profilePicture._id;
        await user.save();
      } catch (err) {
        return handleCatchError(err, args);
      }

      return profilePicture;
    },
    setCoverPicture:
    async (_root: any, args: { input: PictureInput }, context: any): Promise<IPhoto | null> => {
      if (!context.req.user) {
        throw new AuthenticationError("You must be logged in");
      }

      const user = await User.findById(context.req.user.id);
      if (!user) {
        throw new AuthenticationError("You must be logged in");
      }

      const fileType = args.input.type.toLowerCase().split("/");
      if (fileType[0] !== "image") {
        throw new UserInputError("File must be an image file");
      }

      if (args.input.size > (5 * 1024 * 1024)) {
        throw new UserInputError("Image must be less than 5 MB");
      }

      // Delete existing cover photo
      if (user.coverPhoto) {
        try {
          await Photo.findByIdAndDelete(user.coverPhoto);
        } catch (err) {
          logError(err);
        }
      }

      const coverPicture = new Photo({
        imageString: args.input.base64,
        publishDate: Date.now() / 1000,
      });

      try {
        await coverPicture.save();
        user.coverPhoto = coverPicture._id;
        await user.save();
      } catch (err) {
        return handleCatchError(err, args);
      }

      return coverPicture;
    },
    createPost:
    async (_root: any, args: { input: PictureInput }, context: any): Promise<IPhoto | null> => {
      if (!context.req.user) {
        throw new AuthenticationError("You must be logged in");
      }

      const user = await User.findById(context.req.user.id);
      if (!user) {
        throw new AuthenticationError("You must be logged in");
      }

      const fileType = args.input.type.toLowerCase().split("/");
      if (fileType[0] !== "image") {
        throw new UserInputError("File must be an image file");
      }

      if (args.input.size > (5 * 1024 * 1024)) {
        throw new UserInputError("Image must be less than 5 MB");
      }

      if (args.input.captionText.length > 150) {
        throw new UserInputError("Caption text must be less than 150 characters");
      }

      const newPicture = new Photo({
        imageString: args.input.base64,
        publishDate: Date.now() / 1000,
        captionText: args.input.captionText,
      });

      try {
        await newPicture.save();
        user.photos = user.photos.concat(newPicture._id);
        await user.save();
      } catch (err) {
        return handleCatchError(err, args);
      }

      return newPicture;
    },
  },
};

export default resolvers;
