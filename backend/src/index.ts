import { ApolloServer } from "apollo-server";
import connectToMongo from "./mongo";
import createApolloServer from "./apolloServer";
import { logInfo } from "./utils/logger";
import { APOLLO_PORT } from "./utils/config";

connectToMongo();

const startServer = async (): Promise<void> => {
  const apolloServer: ApolloServer = createApolloServer();

  await apolloServer.listen({ port: APOLLO_PORT });
  logInfo(`Apollo Server ready at http://localhost:${APOLLO_PORT}`);
};

startServer();
