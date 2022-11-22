import { FetchResult, MutationResult, useMutation } from "@apollo/client";
import { CREATE_POST } from "../graphql/mutations";
import { ImageFile } from "../types";

const useCreatePost = (): [(props: ImageFile) => Promise<FetchResult>, MutationResult] => {
  const [mutate, result] = useMutation(CREATE_POST);

  // eslint-disable-next-line arrow-body-style
  const createPost = async (props: ImageFile): Promise<FetchResult> => {
    return mutate({ variables: { input: props } });
  };

  return [createPost, result];
};

export default useCreatePost;
