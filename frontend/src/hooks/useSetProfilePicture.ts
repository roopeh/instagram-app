import { FetchResult, MutationResult, useMutation } from "@apollo/client";
import { SET_PROFILE_PICTURE } from "../graphql/mutations";

type ImageFile = {
  type: string,
  size: number,
  base64: string,
};

const useSetProfilePicture = (): [(props: ImageFile) => Promise<FetchResult>, MutationResult] => {
  const [mutate, result] = useMutation(SET_PROFILE_PICTURE);

  // eslint-disable-next-line arrow-body-style
  const setProfilePicture = async (props: ImageFile): Promise<FetchResult> => {
    return mutate({ variables: { input: props } });
  };

  return [setProfilePicture, result];
};

export default useSetProfilePicture;
