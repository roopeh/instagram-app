import { useQuery } from "@apollo/client";
import { ME } from "../graphql/queries";

const useMe = () => {
  const { data, error, loading } = useQuery(ME, {
    fetchPolicy: "cache-and-network",
  });

  const me = data && data.me ? data.me : null;
  return { me, error, loading };
};

export default useMe;
