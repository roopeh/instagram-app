import { FetchResult, MutationResult, useMutation } from "@apollo/client";
import { ADD_COMMENT } from "../graphql/mutations";

interface CommentProps {
  photoId: string,
  message: string,
}

const useAddComment = (): [(props: CommentProps) => Promise<FetchResult>, MutationResult] => {
  const [mutate, result] = useMutation(ADD_COMMENT);

  // eslint-disable-next-line arrow-body-style
  const addComment = async (props: CommentProps): Promise<FetchResult> => {
    return mutate({ variables: { input: props } });
  };

  return [addComment, result];
};

export default useAddComment;
