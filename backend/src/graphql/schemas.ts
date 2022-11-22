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
    captionText: String
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

  input NameInput {
    firstName: String!
    lastName: String!
  }

  input BioTextInput {
    bioText: String!
  }

  type Query {
    userCount: Int!
    getUser(input: UserInput): User
    allUsers: [User!]!
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

    createPost(input: PictureInput): Photo
  }
`;

export default typeDefs;
