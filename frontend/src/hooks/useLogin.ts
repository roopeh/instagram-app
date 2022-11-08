import { FetchResult, MutationResult, useMutation } from "@apollo/client";
import { LOGIN } from "../graphql/mutations";

interface LoginMutationProps {
  username: string,
  password: string,
}

const useLogin = (): [(props: LoginMutationProps) => Promise<FetchResult>, MutationResult] => {
  const [mutate, result] = useMutation(LOGIN);

  // eslint-disable-next-line arrow-body-style
  const login = async (props: LoginMutationProps): Promise<FetchResult> => {
    return mutate({ variables: { input: props } });
  };

  return [login, result];
};

export default useLogin;
