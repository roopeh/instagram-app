const { gql } = require("apollo-server");

// TODO: photo comments, user private messages, user followers/following, paging
const typeDefs = gql`
  type Photo {
    id: ID!
    imageString: String!
    publishDate: String!
  }

  type User {
    id: ID!
    username: String!
    password: String!
    firstName: String!
    lastName: String!
    bioText: String
    profilePhoto: [Photo!]!
    coverPhoto: [Photo!]
    photos: [Photo!]
    photoCount: Int!
  }

  type Query {
    userCount: Int!
    allUsers: [User!]!
  }
`;

export default typeDefs;
