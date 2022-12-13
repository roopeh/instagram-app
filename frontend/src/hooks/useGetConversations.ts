import { useQuery } from "@apollo/client";
import { GET_CONVERSATIONS } from "../graphql/queries";
import { Conversation } from "../types";

const useGetConversations = () => {
  const {
    data, error, loading, refetch, subscribeToMore,
  } = useQuery(GET_CONVERSATIONS, {
    fetchPolicy: "cache-and-network",
  });

  const conversations: Array<Conversation> | null = data && data.getMessages
    ? data.getMessages
    : null;

  return {
    conversations, error, loading, refetch, subscribeToMore,
  };
};

export default useGetConversations;
