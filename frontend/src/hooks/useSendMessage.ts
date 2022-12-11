import { FetchResult, MutationResult, useMutation } from "@apollo/client";
import { SEND_MESSAGE } from "../graphql/mutations";

interface MessageProps {
  conversation: string,
  message: string,
}

const useSendMessage = (): [(props: MessageProps) => Promise<FetchResult>, MutationResult] => {
  const [mutate, result] = useMutation(SEND_MESSAGE);

  const sendMessage = async (props: MessageProps): Promise<FetchResult> => (
    mutate({ variables: { input: props } })
  );

  return [sendMessage, result];
};

export default useSendMessage;
