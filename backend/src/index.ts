import "dotenv/config";
import { ApolloServer } from "apollo-server";
import connectToMongo from "./mongo";
import createApolloServer from "./apolloServer";
import { logError, logInfo } from "./utils/logger";
import { APOLLO_PORT } from "./utils/config";

const startServer = async (): Promise<void> => {
  // Wait for db connection before continuing
  const connectedToDb = await connectToMongo();
  if (!connectedToDb) {
    logError("Exiting");
    process.exit(1);
  }

  const apolloServer: ApolloServer = createApolloServer();
  await apolloServer.listen({ port: APOLLO_PORT });

  logInfo(`Apollo Server ready at http://localhost:${APOLLO_PORT}`);
};

startServer();
