import { FetchResult, MutationResult, useMutation } from "@apollo/client";
import { SET_BIOTEXT } from "../graphql/mutations";

interface BioTextProps {
  bioText: string,
}

const useSetBioText = (): [(props: BioTextProps) => Promise<FetchResult>, MutationResult] => {
  const [mutate, result] = useMutation(SET_BIOTEXT);

  // eslint-disable-next-line arrow-body-style
  const setBioText = async (props: BioTextProps): Promise<FetchResult> => {
    return mutate({ variables: { input: props } });
  };

  return [setBioText, result];
};

export default useSetBioText;
