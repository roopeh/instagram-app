import { useLazyQuery } from "@apollo/client";
import { ALL_USERS } from "../graphql/queries";
import { User } from "../types";

const useAllUsers = () => {
  const [getAllUsers, { data, error, loading }] = useLazyQuery(ALL_USERS, {
    fetchPolicy: "cache-and-network",
  });

  const allUsers: Array<User> | null = data && data.allUsers ? data.allUsers : null;
  return {
    getAllUsers, allUsers, error, loading,
  };
};

export default useAllUsers;
