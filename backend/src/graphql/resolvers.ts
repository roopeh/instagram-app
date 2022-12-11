/* eslint-disable no-underscore-dangle */
import { ApolloError, AuthenticationError, UserInputError } from "apollo-server";
import {
  mongo, Error, FilterQuery, Types,
} from "mongoose";
import Photo from "../models/Photo";
import User from "../models/User";
import Like from "../models/Like";
import {
  BioTextInput, IPhoto, IUser, NameInput, PictureInput,
  UserInput, UserLoginInput, UserRegisterInput, PictureQueryInput,
  PictureIdInput, CommentInput, FollowInput, UserQueryInput, DbUser,
  MessageInput, ConversationInput, IConversation,
} from "../types";
import setTokenCookies from "../utils/cookies";
import { logError } from "../utils/logger";
import { setTokens } from "../utils/tokens";
import Comment from "../models/Comment";
import Conversation from "../models/Conversation";
import Message from "../models/Message";

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

const containsAll = (arr1: Array<string>, arr2: Array<string>): boolean => (
  arr2.every((arr2Item) => arr1.includes(arr2Item))
);
const hasSameParticipiants = (arr1: Array<string>, arr2: Array<string>): boolean => (
  containsAll(arr1, arr2) && containsAll(arr2, arr1)
);

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
const PopulateUserMessages = {
  path: "messages",
  populate: { path: "participiants", populate: { path: "profilePhoto" } },
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
const PopulateParticipiants = {
  path: "participiants",
  populate: { path: "profilePhoto" },
};
const PopulateConversationMessages = {
  path: "messages",
  populate: { path: "sender", populate: { path: "profilePhoto" } },
  options: { sort: { date: 1 } },
};

const findUser = async (variables: any) => User
  .findOne(variables)
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
    getFeedPhotos: async (_root: any, _args: any, context: any): Promise<Array<IPhoto> | null> => {
      if (!context.req.user) {
        throw new AuthenticationError("You must be logged in");
      }

      const user = await User.findById(context.req.user.id);
      if (!user) {
        throw new AuthenticationError("You must be logged in");
      }

      const photos = await Photo.find({
        author: { $in: user.following },
        isFeedPhoto: true,
      })
        .populate(PopulateAuthor)
        .populate(PopulateLikes)
        .sort({ publishDate: -1 });
      return photos;
    },
    allUsers: async (_root: any, args: { input: UserQueryInput }): Promise<Array<IUser>> => {
      if (!args.input || (!args.input.username && !args.input.firstName && !args.input.lastName)) {
        return User.find({}).populate(PopulateProfileAndCoverPhoto);
      }

      const { username, firstName, lastName } = args.input;
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
      if (user) {
        await user.populate(PopulateUserMessages);
      }
      return user;
    },
    getMessages:
    async (_root: any, _args: any, context: any): Promise<Array<IConversation> | null> => {
      if (!context.req.user) {
        throw new AuthenticationError("You must be logged in");
      }

      const user = await User.findById(context.req.user.id);
      if (!user) {
        throw new AuthenticationError("You must be logged in");
      }

      const conversations = await Conversation.find({ _id: { $in: user.messages } })
        .populate(PopulateParticipiants)
        .populate(PopulateConversationMessages);
      return conversations;
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
        isFeedPhoto: false,
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
        isFeedPhoto: false,
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
        isFeedPhoto: true,
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
    createConversation:
    async (_: any, args: { input: ConversationInput }, context: any)
    : Promise<IConversation | null> => {
      if (!context.req.user) {
        throw new AuthenticationError("You must be logged in");
      }

      const user = await User.findById(context.req.user.id)
        .populate(PopulateUserMessages);
      if (!user) {
        throw new AuthenticationError("You must be logged in");
      }

      if (!args.input.receivers.length) {
        throw new UserInputError("Conversation cannot be empty");
      }

      if (args.input.receivers.length === 1) {
        if (user._id.equals(args.input.receivers.at(0)!)) {
          throw new UserInputError("You cannot create a conversation with yourself");
        }
      }

      // Check if user already has a conversation with exactly same users
      if (user.messages.length) {
        const userConversations = await Conversation.find({ _id: { $in: user.messages } });
        userConversations.forEach((conversation) => {
          const stringArr: Array<string> = [];
          conversation.participiants.forEach((itr) => {
            if (!itr.equals(user._id)) {
              stringArr.push(itr.toString());
            }
          });

          if (hasSameParticipiants(stringArr, args.input.receivers)) {
            throw new UserInputError("You already have a conversation with these users");
          }
        });
      }

      // Create participiants array and add authorized user into it
      const participiants: Array<Types.ObjectId> = [];
      participiants.push(user._id);

      // Add each participiant to the list
      const allUsers = await User.find({});
      args.input.receivers.forEach((userId) => {
        const chatUser = allUsers.find((usr) => usr._id.equals(userId));
        if (chatUser) {
          const hasUser = participiants.find((itr) => itr.equals(chatUser._id));
          if (!hasUser) {
            participiants.push(chatUser._id);
          }
        }
      });

      if (participiants.length === 1) {
        if (user._id.equals(participiants.at(0)!)) {
          throw new UserInputError("Conversation cannot be empty");
        }
      }

      // If receiver has already created a conversation with this user
      // but conversation has no messages yet, new conversation should not be created
      const existingConversations = await Conversation
        .find({ participiants: { $in: [user._id] } });
      if (existingConversations) {
        const conversation = existingConversations.find((itr) => (
          hasSameParticipiants(
            participiants.map((id) => id.toString()),
            itr.participiants.map((id) => id.toString()),
          )));
        if (conversation) {
          try {
            user.messages = user.messages.concat(conversation.id);
            await user.save();
          } catch (err) {
            handleCatchError(err, args);
          }

          await conversation.populate(PopulateParticipiants);
          return conversation;
        }
      }

      const newConversation = new Conversation({ participiants });
      try {
        await newConversation.save();
        // Add conversation only to sender
        // When first message is sent, then its added to receiver as well
        user.messages = user.messages.concat(newConversation._id);
        await user.save();
      } catch (err) {
        handleCatchError(err, args);
      }

      await newConversation.populate(PopulateParticipiants);
      return newConversation;
    },
    sendMessage:
    async (_root: any, args: { input: MessageInput }, context: any): Promise<IConversation> => {
      if (!context.req.user) {
        throw new AuthenticationError("You must be logged in");
      }

      const user = await User.findById(context.req.user.id);
      if (!user) {
        throw new AuthenticationError("You must be logged in");
      }

      if (!args.input.message.length) {
        throw new UserInputError("Message can not be empty");
      }

      const conversation = await Conversation.findById(args.input.conversation)
        .populate(PopulateParticipiants);
      if (!conversation) {
        throw new UserInputError("Conversation does not exist");
      }

      // Check if user is part of this conversation
      const isInConversation = conversation.participiants.find((itr) => itr._id.equals(user._id));
      if (!isInConversation) {
        throw new UserInputError("You are not part of this conversation");
      }

      const allParticipiants = conversation.participiants
        .filter((usr) => !usr._id.equals(user._id));

      const newMessage = new Message({
        sender: user._id,
        conversation: conversation._id,
        date: Date.now(),
        message: args.input.message,
        usersUnread: allParticipiants,
      });

      // Make sure conversation exists in all user's messages
      allParticipiants.forEach(async (userId) => {
        const conversationUser = await User.findById(userId);
        if (!conversationUser) {
          throw new UserInputError("One of the participiants does not exist");
        }

        const hasConversation = conversationUser.messages.find(
          (itr) => itr.equals(conversation._id),
        );
        if (!hasConversation) {
          try {
            conversationUser.messages = conversationUser.messages.concat(conversation._id);
            await conversationUser.save();
          } catch (err) {
            handleCatchError(err, args);
          }
        }
      });

      try {
        await newMessage.save();
        conversation.messages = conversation.messages.concat(newMessage._id);
        await conversation.save();
      } catch (err) {
        handleCatchError(err, args);
      }

      await conversation.populate(PopulateConversationMessages);
      return conversation;
    },
  },
};

export default resolvers;
