import { FetchResult, MutationResult, useMutation } from "@apollo/client";
import { TOGGLE_LIKE } from "../graphql/mutations";

interface LikeProps {
  photoId: string,
}

const useToggleLike = (): [(props: LikeProps) => Promise<FetchResult>, MutationResult] => {
  const [mutate, result] = useMutation(TOGGLE_LIKE);

  // eslint-disable-next-line arrow-body-style
  const toggleLike = async (props: LikeProps): Promise<FetchResult> => {
    return mutate({ variables: { input: props } });
  };

  return [toggleLike, result];
};

export default useToggleLike;
