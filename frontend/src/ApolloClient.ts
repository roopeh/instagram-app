import {
  ApolloClient, ApolloLink, HttpLink, InMemoryCache, NormalizedCacheObject, split,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

const publicWebsocketUrl: string = "wss://instagram-app-2022.fly.dev/graphql";

const httpLink = new HttpLink({
  uri: process.env.NODE_ENV === "production"
    ? "/graphql"
    : "http://localhost:8080/graphql",
  credentials: process.env.NODE_ENV === "production"
    ? "same-origin"
    : "include",
});

const websocketLink = new GraphQLWsLink(
  createClient({
    url: process.env.NODE_ENV === "production"
      ? publicWebsocketUrl
      : "ws://localhost:8080/graphql",
  }),
);

const splitLink: ApolloLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition"
      && definition.operation === "subscription"
    );
  },
  websocketLink,
  httpLink,
);

const createApolloClient = (): ApolloClient<NormalizedCacheObject> => new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      User: {
        fields: {
          photos: {
            merge(_, incoming: any[]) {
              return [...incoming];
            },
          },
          followers: {
            merge(_, incoming: any[]) {
              return [...incoming];
            },
          },
          following: {
            merge(_, incoming: any[]) {
              return [...incoming];
            },
          },
        },
      },
      Photo: {
        fields: {
          likes: {
            merge(_, incoming: any[]) {
              return [...incoming];
            },
          },
        },
      },
    },
  }),
  link: splitLink,
});

export default createApolloClient;
