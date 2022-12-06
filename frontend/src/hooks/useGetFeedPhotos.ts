import { useQuery } from "@apollo/client";
import { GET_FEED_PHOTOS } from "../graphql/queries";
import { Photo } from "../types";

const useGetFeedPhotos = () => {
  const { data, error, loading } = useQuery(GET_FEED_PHOTOS, {
    fetchPolicy: "cache-and-network",
  });

  const feedPhotos: Array<Photo> | null = data && data.getFeedPhotos ? data.getFeedPhotos : null;
  return { feedPhotos, error, loading };
};

export default useGetFeedPhotos;
