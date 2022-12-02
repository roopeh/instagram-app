import { useLazyQuery, useQuery } from "@apollo/client";
import { ME } from "../graphql/queries";
import { User } from "../types";

export const useMe = () => {
  const { data, error, loading } = useQuery(ME, {
    fetchPolicy: "cache-and-network",
  });

  const me: User | null = data && data.me ? data.me : null;
  return { me, error, loading };
};

export const useLazyMe = () => {
  const [getMe, { data, error, loading }] = useLazyQuery(ME, {
    fetchPolicy: "cache-and-network",
  });

  const me: User | null = data && data.me ? data.me : null;
  return {
    getMe, me, error, loading,
  };
};
