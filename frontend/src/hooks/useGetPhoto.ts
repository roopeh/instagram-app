import { useQuery } from "@apollo/client";
import { GET_PHOTO } from "../graphql/queries";
import { Photo } from "../types";

interface PhotoProps {
  username: string,
  photoId: string | undefined,
}

const useGetPhoto = (props: PhotoProps) => {
  const { data, error, loading } = useQuery(GET_PHOTO, {
    variables: { input: props },
    fetchPolicy: "cache-and-network",
  });

  const photo: Photo | null = data && data.getPhoto ? data.getPhoto : null;
  return { photo, error, loading };
};

export default useGetPhoto;
