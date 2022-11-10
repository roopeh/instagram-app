import { gql } from "apollo-server";

// TODO: paging
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
    date: String!
    message: String!
  }

  type Photo {
    id: ID!
    imageString: String!
    publishDate: String!
    likes: [User!]
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

  type Query {
    userCount: Int!
    allUsers: [User!]!
    me: User
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
    size: Int!
    base64: String!
  }

  type Mutation {
    createUser(input: UserRegisterInput): User
    login(input: UserLoginInput): User
    logout: Boolean

    setProfilePicture(input: PictureInput): Photo
  }
`;

export default typeDefs;
