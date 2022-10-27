import { ApolloServer } from "apollo-server";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/schemas";

const createApolloServer = (): ApolloServer => new ApolloServer({
  resolvers,
  typeDefs,
});

export default createApolloServer;
