import { ApolloServer } from "apollo-server";
import createApolloServer from "./apolloServer";

const startServer = async () => {
  const APOLLO_PORT = 4000;

  const apolloServer: ApolloServer = createApolloServer();
  await apolloServer.listen({ port: APOLLO_PORT });
  console.log(`Apollo Server ready at http://localhost:${APOLLO_PORT}`);
};

startServer();
