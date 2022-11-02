import { MutationResult, useMutation } from "@apollo/client";
import { REGISTER } from "../graphql/mutations";

interface RegisterMutationProps {
  username: string,
  password: string,
  firstName: string,
  lastName: string,
}

const useRegister = (): [(props: RegisterMutationProps) => Promise<void>, MutationResult] => {
  const [mutate, result] = useMutation(REGISTER);

  const register = async (props: RegisterMutationProps): Promise<void> => {
    await mutate({ variables: { input: props } });
  };

  return [register, result];
};

export default useRegister;
