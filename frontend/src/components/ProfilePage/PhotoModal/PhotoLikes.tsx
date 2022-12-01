import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import EmptyProfilePic from "../../../assets/empty_profile.png";
import { useGetPhotoLikes } from "../../../hooks/useGetPhoto";
import useToggleLike from "../../../hooks/useToggleLike";
import { getUserData } from "../../../utils/userdata";
import { Like } from "../../../types";

interface LikesProps {
  username: string,
  photoId: string,
  smallerThanThreshold: boolean,
  setError: (err: string) => void,
}

const PhotoLikes = ({
  username, photoId, smallerThanThreshold, setError,
}: LikesProps) => {
  const getLikesQuery = useGetPhotoLikes({ username, photoId });
  const [toggleLike] = useToggleLike();
  const [likesCount, setLikesCount] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (getLikesQuery.error || (!getLikesQuery.photo && !getLikesQuery.loading)) {
      navigate("/notfound");
    }
    if (getLikesQuery.photo) {
      setLikesCount(getLikesQuery.photo.likesCount);
    }
  }, [getLikesQuery.error, getLikesQuery.photo]);

  const { photo } = getLikesQuery;
  const userData = getUserData();
  const likeIcon: React.CSSProperties = {
    width: "calc(100% * 0.3)", aspectRatio: "1.0", color: "#0000EE", cursor: "pointer",
  };

  const handleToggleLike = async (): Promise<void> => {
    if (!photo) {
      return;
    }

    try {
      await toggleLike({ photoId: photo.id });
    } catch (err) {
      setError(String(err));
    }
  };

  // eslint-disable-next-line arrow-body-style
  const formatLikes = (like: number): string => {
    return like >= 1000 ? `${Math.sign(like) * Number((like / 1000).toFixed(1))}k` : like.toString();
  };

  const hasUserLiked: boolean = userData && photo
    ? !(!photo.likes.find((like) => like.user.id === userData.id))
    : false;

  const likers: Array<Like> = photo
    ? photo.likes.slice(0, smallerThanThreshold ? 6 : 4) : [];

  return (
    <>
      <div
        className="photoModal__topFlex__likeContainer"
        style={!smallerThanThreshold ? { borderLeft: "0px" } : {}}
      >
        {hasUserLiked ? (
          <FavoriteIcon
            style={likeIcon}
            onClick={handleToggleLike}
          />
        ) : (
          <FavoriteBorderIcon
            style={likeIcon}
            onClick={handleToggleLike}
          />
        )}
        <span className="photoModal__topFlex__likeText">
          {formatLikes(likesCount)}
        </span>
      </div>
      <div className="photoModal__topFlex__likers">
        {likers.map((like) => (
          <Link key={like.user.id} to={`/${like.user.username}`}>
            <div
              className="photoModal__avatar"
              title={like.user.username}
              style={{
                backgroundImage: `url(${like.user.profilePhoto
                  ? like.user.profilePhoto.imageString
                  : EmptyProfilePic})`,
              }}
            />
          </Link>
        ))}
      </div>
    </>
  );
};

export default PhotoLikes;
