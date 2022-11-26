import { useQuery } from "@apollo/client";
import { GET_USER } from "../graphql/queries";
import { User } from "../types";

interface UserProps {
  username: string,
}

const useGetUser = (props: UserProps) => {
  const { data, error, loading } = useQuery(GET_USER, {
    variables: { input: props },
    fetchPolicy: "cache-and-network",
  });

  const user: User | null = data && data.getUser ? data.getUser : null;
  return { user, error, loading };
};

export default useGetUser;
