import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServerPluginLandingPageDisabled, ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/schemas";

const createApolloServer = (): ApolloServer => {
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  return new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
    plugins: [
      process.env.NODE_ENV === "development"
        ? ApolloServerPluginLandingPageLocalDefault()
        : ApolloServerPluginLandingPageDisabled(),
    ],
  });
};

export default createApolloServer;
