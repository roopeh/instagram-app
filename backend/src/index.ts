import "dotenv/config";
import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import path from "path";
import connectToMongo from "./mongo";
import createApolloServer from "./apolloServer";
import tokenValidationMiddleware from "./utils/middleware/tokenValidationMiddleware";
import { logError, logInfo } from "./utils/logger";
import { APOLLO_PORT } from "./utils/config";

const startServer = async (): Promise<void> => {
  // Wait for db connection before continuing
  const connectedToDb = await connectToMongo();
  if (!connectedToDb) {
    logError("Exiting");
    process.exit(1);
  }

  const app = express();
  const httpServer = http.createServer(app);

  app.use(express.static(
    process.env.NODE_ENV === "production"
      ? "build/frontend"
      : "frontend",
  ));
  app.use(cors({
    origin: process.env.NODE_ENV !== "production"
      ? [
        "http://localhost:3000",
        "https://studio.apollographql.com",
      ] : [
        "https://instagram-app-2022.fly.dev/",
      ],
    credentials: true,
  }));
  app.use(cookieParser());
  app.use(tokenValidationMiddleware);

  const apolloServer: ApolloServer = createApolloServer();
  await apolloServer.start();

  // Execution order depends on node environment
  if (process.env.NODE_ENV === "production") {
    app.get("/*", (_req, res) => {
      res.sendFile(path.join(__dirname, "frontend", "index.html"));
    });
    apolloServer.applyMiddleware({ app, path: "/graphql", cors: false });
  } else {
    apolloServer.applyMiddleware({ app, path: "/graphql", cors: false });
    app.get("/*", (_req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "index.html"));
    });
  }

  httpServer.listen(APOLLO_PORT, () => {
    logInfo(`Apollo Server ready at http://localhost:${APOLLO_PORT}`);
  });
};

startServer();
