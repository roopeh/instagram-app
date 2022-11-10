import { MutationResult, useMutation } from "@apollo/client";
import { LOGOUT } from "../graphql/mutations";
import { removeUserData } from "../utils/userdata";

const useLogout = (): [() => Promise<void>, MutationResult] => {
  const [mutate, result] = useMutation(LOGOUT);

  const logout = async (): Promise<void> => {
    removeUserData();
    await mutate();
  };

  return [logout, result];
};

export default useLogout;
