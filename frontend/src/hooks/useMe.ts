import { useQuery } from "@apollo/client";
import { ME } from "../graphql/queries";

const useMe = () => {
  const { data, error, loading } = useQuery(ME, {
    fetchPolicy: "network-only",
  });

  const me = data && data.me ? data.me : null;

  return { me, error, loading };
};

export default useMe;
