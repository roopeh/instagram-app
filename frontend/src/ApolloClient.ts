import {
  ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject,
} from "@apollo/client";

const createApolloClient = (): ApolloClient<NormalizedCacheObject> => new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://localhost:4000",
  }),
});

export default createApolloClient;
