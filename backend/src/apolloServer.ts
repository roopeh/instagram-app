import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/schemas";

const createApolloServer = (): ApolloServer => {
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  return new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
  });
};

export default createApolloServer;
