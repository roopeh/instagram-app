import { useQuery } from "@apollo/client";
import { GET_PHOTO, GET_PHOTO_LIKES, GET_PHOTO_COMMENTS } from "../graphql/queries";
import { Photo } from "../types";

interface PhotoProps {
  username: string,
  photoId: string | undefined,
}

export const useGetPhoto = (props: PhotoProps) => {
  const { data, error, loading } = useQuery(GET_PHOTO, {
    variables: { input: props },
    fetchPolicy: "cache-and-network",
  });

  const photo: Photo | null = data && data.getPhoto ? data.getPhoto : null;
  return { photo, error, loading };
};

export const useGetPhotoLikes = (props: PhotoProps) => {
  const {
    data, error, loading, refetch,
  } = useQuery(GET_PHOTO_LIKES, {
    variables: { input: props },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const photo: Photo | null = data && data.getPhoto ? data.getPhoto : null;
  return {
    photo, error, loading, refetch,
  };
};

export const useGetPhotoComments = (props: PhotoProps) => {
  const {
    data, error, loading, refetch,
  } = useQuery(GET_PHOTO_COMMENTS, {
    variables: { input: props },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const photo: Photo | null = data && data.getPhoto ? data.getPhoto : null;
  return {
    photo, error, loading, refetch,
  };
};
