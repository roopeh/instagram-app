/* eslint-disable no-underscore-dangle */
import { ApolloError, AuthenticationError, UserInputError } from "apollo-server";
import { mongo, Error, FilterQuery } from "mongoose";
import Photo from "../models/Photo";
import User from "../models/User";
import Like from "../models/Like";
import {
  BioTextInput, IPhoto, IUser, NameInput, PictureInput,
  UserInput, UserLoginInput, UserRegisterInput, PictureQueryInput,
  PictureIdInput, CommentInput, FollowInput, UserQueryInput, DbUser,
} from "../types";
import setTokenCookies from "../utils/cookies";
import { logError } from "../utils/logger";
import { setTokens } from "../utils/tokens";
import Comment from "../models/Comment";

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

const PopulateProfileAndCoverPhoto = ["profilePhoto", "coverPhoto"];
const PopulatePhotos = { path: "photos", options: { sort: { publishDate: -1 } } };
const PopulateFollowing = {
  path: "following",
  populate: { path: "profilePhoto" },
  options: { sort: { username: 1 } },
};
const PopulateFollowers = {
  path: "followers",
  populate: { path: "profilePhoto" },
  options: { sort: { username: 1 } },
};
const PopulateAuthor = { path: "author", populate: { path: "profilePhoto" } };
const PopulateLikes = {
  path: "likes",
  populate: { path: "user", populate: { path: "profilePhoto" } },
  options: { sort: { likeDate: -1 } },
};
const PopulateComments = {
  path: "comments",
  populate: { path: "author", populate: { path: "profilePhoto" } },
  options: { sort: { date: 1 } },
};

const findUser = async (variables: any) => User
  .findOne(variables)
  // todo: messages
  .populate(PopulateProfileAndCoverPhoto)
  .populate(PopulatePhotos)
  .populate(PopulateFollowing)
  .populate(PopulateFollowers);

const findPhoto = async (variables: any): Promise<IPhoto | null> => Photo
  .findOne(variables)
  .populate(PopulateAuthor)
  .populate(PopulateLikes)
  .populate(PopulateComments);

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
    getPhoto: async (_root: any, args: { input: PictureQueryInput }): Promise<IPhoto | null> => {
      const user = await User.findOne({ username: args.input.username.toLowerCase() });
      if (!user) {
        return null;
      }

      const photo = await findPhoto({ _id: args.input.photoId, author: user._id });
      if (!photo) {
        return null;
      }

      return photo;
    },
    allUsers: async (_root: any, args: { input: UserQueryInput }): Promise<Array<IUser>> => {
      const { username, firstName, lastName } = args.input;
      if (!username && !firstName && !lastName) {
        return User.find({}).populate(PopulateProfileAndCoverPhoto);
      }

      if ((username && username.length < 3)
        || (firstName && firstName.length < 3)
        || (lastName && lastName.length < 3)) {
        throw new UserInputError("Search string must be over 3 characters");
      }

      const filterQuery: Array<FilterQuery<DbUser>> = [];
      if (username) filterQuery.push({ username: { $regex: username, $options: "i" } });
      if (firstName) filterQuery.push({ firstName: { $regex: firstName, $options: "i" } });
      if (lastName) filterQuery.push({ lastName: { $regex: lastName, $options: "i" } });
      return User.find({ $or: filterQuery }).populate(PopulateProfileAndCoverPhoto);
    },
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
      const lowCaseUsername = args.input.username.toLowerCase();
      // Check if username already exists
      const existingUsername = await User.findOne({ username: lowCaseUsername });
      if (existingUsername) {
        throw new UserInputError("Username already exists");
      }

      if (lowCaseUsername === "accounts" || lowCaseUsername === "notfound") {
        throw new UserInputError("Invalid username");
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
        username: lowCaseUsername,
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
        author: user._id,
        publishDate: Date.now(),
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
        author: user._id,
        publishDate: Date.now(),
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
    async (_root: any, args: { input: PictureInput }, context: any): Promise<IUser | null> => {
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
        author: user._id,
        publishDate: Date.now(),
        captionText: args.input.captionText,
      });

      try {
        await newPicture.save();
        user.photos = user.photos.concat(newPicture._id);
        await user.save();
      } catch (err) {
        return handleCatchError(err, args);
      }

      await user.populate(PopulatePhotos);
      return user;
    },
    deletePost:
    async (_root: any, args: { input: PictureIdInput }, context: any): Promise<IUser | null> => {
      if (!context.req.user) {
        throw new AuthenticationError("You must be logged in");
      }

      const user = await User.findById(context.req.user.id);
      if (!user) {
        throw new AuthenticationError("You must be logged in");
      }

      const photo = await Photo.findById(args.input.photoId);
      if (!photo) {
        throw new UserInputError("Photo does not exist");
      }

      if (!photo.author.equals(user._id)) {
        throw new UserInputError("You cannot delete that photo");
      }

      try {
        if (user.profilePhoto && user.profilePhoto.equals(photo._id)) {
          await User.updateOne({ _id: user._id }, { $unset: { profilePhoto: "" } });
        }
        if (user.coverPhoto && user.coverPhoto.equals(photo._id)) {
          await User.updateOne({ _id: user._id }, { $unset: { coverPhoto: "" } });
        }
        user.photos = user.photos.filter((itr) => !itr.equals(photo._id));
        await user.save();
        await Like.deleteMany({ photo: photo._id });
        await Comment.deleteMany({ photo: photo._id });
        await Photo.findByIdAndDelete(photo._id);
      } catch (err) {
        handleCatchError(err, args);
      }

      await user.populate(PopulateProfileAndCoverPhoto);
      await user.populate(PopulatePhotos);
      return user;
    },
    toggleLike:
    async (_: any, args: { input: PictureIdInput }, context: any): Promise<IPhoto | null> => {
      if (!context.req.user) {
        throw new AuthenticationError("You must be logged in");
      }

      const user = await User.findById(context.req.user.id);
      if (!user) {
        throw new AuthenticationError("You must be logged in");
      }

      const photo = await Photo.findById(args.input.photoId);
      if (!photo) {
        throw new UserInputError("Photo does not exist");
      }

      const findUserLike = await Like.findOne({ photo: photo._id, user: user._id });
      if (findUserLike) {
        // User has already liked the photo => remove like
        try {
          photo.likes = photo.likes.filter((like) => !like.equals(findUserLike._id));
          await photo.save();
          await Like.findByIdAndDelete(findUserLike._id);
        } catch (err) {
          handleCatchError(err, args);
        }

        await photo.populate(PopulateLikes);
        return photo;
      }

      const newLike = new Like({
        user: user._id,
        photo: photo._id,
        likeDate: Date.now(),
      });

      try {
        await newLike.save();
        photo.likes = photo.likes.concat(newLike._id);
        await photo.save();
      } catch (err) {
        handleCatchError(err, args);
      }

      await photo.populate(PopulateLikes);
      return photo;
    },
    addComment:
    async (_root: any, args: { input: CommentInput }, context: any): Promise<IPhoto | null> => {
      if (!context.req.user) {
        throw new AuthenticationError("You must be logged in");
      }

      const user = await User.findById(context.req.user.id);
      if (!user) {
        throw new AuthenticationError("You must be logged in");
      }

      const photo = await Photo.findById(args.input.photoId);
      if (!photo) {
        throw new UserInputError("Photo does not exist");
      }

      const newComment = new Comment({
        author: user._id,
        photo: photo._id,
        date: Date.now(),
        message: args.input.message,
      });

      try {
        await newComment.save();
        photo.comments = photo.comments.concat(newComment._id);
        await photo.save();
      } catch (err) {
        handleCatchError(err, args);
      }

      await photo.populate(PopulateComments);
      return photo;
    },
    followUser:
    async (_root: any, args: { input: FollowInput }, context: any): Promise<IUser | null> => {
      if (!context.req.user) {
        throw new AuthenticationError("You must be logged in");
      }

      const user = await User.findById(context.req.user.id);
      if (!user) {
        throw new AuthenticationError("You must be logged in");
      }

      const followUser = await User.findById(args.input.userId);
      if (!followUser) {
        throw new UserInputError("User does not exist");
      }

      const findFollowing = user.following.find((itr) => itr._id.equals(followUser._id));
      if (findFollowing) {
        // User is already following this user => unfollow
        user.following = user.following.filter((following) => !following.equals(followUser._id));
        followUser.followers = followUser.followers.filter((itr) => !itr.equals(user._id));

        try {
          await user.save();
          await followUser.save();
        } catch (err) {
          handleCatchError(err, args);
        }

        await followUser.populate(PopulateFollowers);
        await followUser.populate(PopulateFollowing);
        return followUser;
      }

      if (followUser._id.equals(user._id)) {
        throw new UserInputError("You cannot follow yourself");
      }

      user.following = user.following.concat(followUser._id);
      followUser.followers = followUser.followers.concat(user._id);
      try {
        await user.save();
        await followUser.save();
      } catch (err) {
        handleCatchError(err, args);
      }

      await followUser.populate(PopulateFollowers);
      await followUser.populate(PopulateFollowing);
      return followUser;
    },
  },
};

export default resolvers;
