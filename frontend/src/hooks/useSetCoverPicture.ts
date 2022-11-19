import { FetchResult, MutationResult, useMutation } from "@apollo/client";
import { SET_COVER_PICTURE } from "../graphql/mutations";
import { ImageFile } from "../types";

const useSetCoverPicture = (): [(props: ImageFile) => Promise<FetchResult>, MutationResult] => {
  const [mutate, result] = useMutation(SET_COVER_PICTURE);

  // eslint-disable-next-line arrow-body-style
  const setCoverPicture = async (props: ImageFile): Promise<FetchResult> => {
    return mutate({ variables: { input: props } });
  };

  return [setCoverPicture, result];
};

export default useSetCoverPicture;
