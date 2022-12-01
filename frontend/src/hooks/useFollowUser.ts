import { FetchResult, MutationResult, useMutation } from "@apollo/client";
import { FOLLOW_USER } from "../graphql/mutations";

interface FollowUserProps {
  userId: string,
}

const useFollowUser = (): [(props: FollowUserProps) => Promise<FetchResult>, MutationResult] => {
  const [mutate, result] = useMutation(FOLLOW_USER);

  // eslint-disable-next-line arrow-body-style
  const followUser = async (props: FollowUserProps): Promise<FetchResult> => {
    return mutate({ variables: { input: props } });
  };

  return [followUser, result];
};

export default useFollowUser;
