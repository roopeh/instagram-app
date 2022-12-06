import { gql } from "apollo-server";

// TODO: paging
// Message usersRead => usersUnread?
// FollowInfo type with date?
const typeDefs = gql`
  type Message {
    id: ID!
    sender: User!
    date: String!
    message: String!
    usersRead: [User!]!
  }

  type Conversation {
    participiants: [User!]!
    messages: [Message!]!
  }

  type Comment {
    id: ID!
    author: User!
    photo: Photo!
    date: String!
    message: String!
  }

  type Like {
    id: ID!
    user: User!
    photo: Photo!
    likeDate: String!
  }

  type Photo {
    id: ID!
    imageString: String!
    author: User!
    publishDate: String!
    captionText: String
    isFeedPhoto: Boolean!
    likes: [Like!]
    likesCount: Int!
    comments: [Comment!]
    commentsCount: Int!
  }

  type User {
    id: ID!
    username: String!
    password: String!
    firstName: String!
    lastName: String!
    bioText: String
    lastOnline: String
    profilePhoto: Photo
    coverPhoto: Photo
    photos: [Photo!]!
    photoCount: Int!
    following: [User!]!
    followingCount: Int!
    followers: [User!]!
    followersCount: Int!
    messages: [Conversation!]!
  }

  input UserRegisterInput {
    username: String!
    password: String!
    firstName: String!
    lastName: String!
  }

  input UserLoginInput {
    username: String!
    password: String!
  }

  input PictureInput {
    type: String!
    captionText: String!
    size: Int!
    base64: String!
  }

  input UserInput {
    username: String!
  }

  input UserQueryInput {
    username: String
    firstName: String
    lastName: String
  }

  input NameInput {
    firstName: String!
    lastName: String!
  }

  input BioTextInput {
    bioText: String!
  }

  input PictureQueryInput {
    username: String!,
    photoId: String!,
  }

  input PictureIdInput {
    photoId: String!,
  }

  input CommentInput {
    photoId: String!,
    message: String!,
  }

  input FollowInput {
    userId: String!,
  }

  type Query {
    userCount: Int!
    getUser(input: UserInput): User
    getPhoto(input: PictureQueryInput): Photo
    getFeedPhotos: [Photo!]
    allUsers(input: UserQueryInput): [User!]!
    me: User
  }

  type Mutation {
    createUser(input: UserRegisterInput): User
    login(input: UserLoginInput): User
    logout: Boolean

    setNames(input: NameInput): User
    setBioText(input: BioTextInput): User
    setProfilePicture(input: PictureInput): Photo
    setCoverPicture(input: PictureInput): Photo

    createPost(input: PictureInput): User
    deletePost(input: PictureIdInput): User
    toggleLike(input: PictureIdInput): Photo
    addComment(input: CommentInput): Photo

    followUser(input: FollowInput): User
  }
`;

export default typeDefs;
