import { FetchResult, MutationResult, useMutation } from "@apollo/client";
import { CREATE_CONVERSATION } from "../graphql/mutations";

interface ConversationProps {
  receivers: Array<string>,
}

const useCreateConversation = (): [
  (props: ConversationProps) => Promise<FetchResult>, MutationResult,
] => {
  const [mutate, result] = useMutation(CREATE_CONVERSATION);

  const createConversation = async (props: ConversationProps): Promise<FetchResult> => (
    mutate({ variables: { input: props } })
  );

  return [createConversation, result];
};

export default useCreateConversation;
