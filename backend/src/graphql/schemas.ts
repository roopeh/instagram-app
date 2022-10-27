const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    userCount: Int!
  }
`;

export default typeDefs;
