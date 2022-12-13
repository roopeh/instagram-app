import { FetchResult, MutationResult, useMutation } from "@apollo/client";
import { USER_TYPING } from "../graphql/mutations";

interface TypingProps {
  conversationId: string,
}

const useUserTyping = (): [(props: TypingProps) => Promise<FetchResult>, MutationResult] => {
  const [mutate, result] = useMutation(USER_TYPING);

  const userTyping = async (props: TypingProps): Promise<FetchResult> => (
    mutate({ variables: { input: props } })
  );

  return [userTyping, result];
};

export default useUserTyping;
