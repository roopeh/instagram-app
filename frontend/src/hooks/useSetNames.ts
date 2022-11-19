import { FetchResult, MutationResult, useMutation } from "@apollo/client";
import { SET_NAMES } from "../graphql/mutations";

interface SetNamesProps {
  firstName: string,
  lastName: string,
}

const useSetNames = (): [(props: SetNamesProps) => Promise<FetchResult>, MutationResult] => {
  const [mutate, result] = useMutation(SET_NAMES);

  // eslint-disable-next-line arrow-body-style
  const setNames = async (props: SetNamesProps): Promise<FetchResult> => {
    return mutate({ variables: { input: props } });
  };

  return [setNames, result];
};

export default useSetNames;
