import {
  ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject,
} from "@apollo/client";

const httpLink = new HttpLink({
  uri: process.env.NODE_ENV === "production"
    ? "/graphql"
    : "http://localhost:8080/graphql",
  credentials: process.env.NODE_ENV === "production"
    ? "same-origin"
    : "include",
});

const createApolloClient = (): ApolloClient<NormalizedCacheObject> => new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
});

export default createApolloClient;
