import { FetchResult, MutationResult, useMutation } from "@apollo/client";
import { DELETE_POST } from "../graphql/mutations";

interface DeleteProps {
  photoId: string,
}

const useDeletePost = (): [(props: DeleteProps) => Promise<FetchResult>, MutationResult] => {
  const [mutate, result] = useMutation(DELETE_POST);

  // eslint-disable-next-line arrow-body-style
  const deletePost = async (props: DeleteProps): Promise<FetchResult> => {
    return mutate({ variables: { input: props } });
  };

  return [deletePost, result];
};

export default useDeletePost;
