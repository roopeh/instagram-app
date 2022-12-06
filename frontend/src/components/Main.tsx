import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AppBar from "./AppBar";
import useGetFeedPhotos from "../hooks/useGetFeedPhotos";
import EmptyProfilePic from "../assets/empty_profile.png";
import { getUserData } from "../utils/userdata";
import "../styles/Feed.css";
import { Like, Photo } from "../types";
import { beautifyBigNumber } from "../utils/numberFormatters";
import { formatDateForPhoto } from "../utils/dateFormatter";
import ErrorModal from "./ErrorModal";
import useToggleLike from "../hooks/useToggleLike";

const RenderLikers = (likers: Array<Like>, likersCount: number): JSX.Element => {
  const likerLink = (username: string): JSX.Element => (
    <Link
      to={`/${username}`}
      style={{ textDecoration: "none" }}
    >
      {username}
    </Link>
  );

  if (likersCount === 0) {
    return <span>No likes yet. Be first to like!</span>;
  } if (likersCount === 1) {
    // eslint-disable-next-line react/destructuring-assignment
    const liker = likers.at(0)!;
    return (
      <>
        {likerLink(liker.user.username)}
        {" likes this"}
      </>
    );
  }

  const threshold: number = 3;
  const moreDetailed: boolean = likersCount <= threshold;

  // eslint-disable-next-line react/destructuring-assignment
  const likerArr: Array<Like> = moreDetailed ? likers : likers.splice(0, threshold);
  return (
    <>
      {likerArr.map((like, i) => {
        if (i === 0) {
          return (
            <span key={like.id}>
              {likerLink(like.user.username)}
            </span>
          );
        } if (moreDetailed && i === (likerArr.length - 1)) {
          return (
            <span key={like.id}>
              {" and "}
              {likerLink(like.user.username)}
            </span>
          );
        }
        return (
          <span key={like.id}>
            {", "}
            {likerLink(like.user.username)}
          </span>
        );
      })}
      {moreDetailed
        ? " like this"
        : ` and ${beautifyBigNumber(likersCount - likerArr.length)} others like this`}
    </>
  );
};

interface DefaultMainProps {
  errorText: string,
  clearError: () => void,
  children: any,
}

const DefaultMain = ({ errorText, clearError, children }: DefaultMainProps) => (
  <div className="main">
    <AppBar />
    <ErrorModal
      text={errorText}
      openBoolean={errorText.length > 0}
      buttonText="Close"
      onClose={clearError}
    />
    {children}
  </div>
);

const EmptyFeed = ({ errorText, clearError, children }: DefaultMainProps) => (
  <DefaultMain errorText={errorText} clearError={clearError}>
    <div className="main__container">
      <div className="feed__defaultContent">
        {children}
      </div>
    </div>
  </DefaultMain>
);

const Main = () => {
  const [errorText, setErrorText] = useState<string>("");
  const { feedPhotos, error, loading } = useGetFeedPhotos();
  const [toggleLike] = useToggleLike();

  const clearError = (): void => setErrorText("");

  useEffect(() => {
    if (error) {
      setErrorText("Internal server error");
    }
  }, [error]);

  const userData = getUserData();
  if (!userData) {
    return (
      <EmptyFeed errorText="" clearError={() => null}>
        todo: not logged in
      </EmptyFeed>
    );
  }

  if (!userData.following || !userData.following.length) {
    return (
      <EmptyFeed errorText={errorText} clearError={clearError}>
        <div className="feed__loading" style={{ textAlign: "center" }}>
          You are not following anybody.
          <br />
          Start to follow accounts to stay updated on their content!
        </div>
      </EmptyFeed>
    );
  }

  if (error) {
    return (
      <EmptyFeed errorText={errorText} clearError={clearError}>
        Error while loading feed.
      </EmptyFeed>
    );
  }
  if ((!feedPhotos && loading)) {
    return (
      <EmptyFeed errorText={errorText} clearError={clearError}>
        <div className="feed__loading">
          <CircularProgress style={{ color: "grey" }} />
        </div>
      </EmptyFeed>
    );
  }

  if (!feedPhotos || !feedPhotos.length) {
    return (
      <EmptyFeed errorText={errorText} clearError={clearError}>
        <div className="feed__loading">
          Accounts that you are following have no content yet...
        </div>
      </EmptyFeed>
    );
  }

  const likeIcon: React.CSSProperties = {
    width: "20px",
    height: "20px",
    color: "#0000EE",
    cursor: "pointer",
    padding: "5px",
    paddingBottom: "0",
  };

  const handleToggleLike = async (photo: Photo): Promise<void> => {
    if (!photo) {
      return;
    }

    try {
      await toggleLike({ photoId: photo.id });
    } catch (err) {
      setErrorText(String(err));
    }
  };

  const printPhotoDate = (date: number): JSX.Element => {
    const [formattedDate, detailedDate] = formatDateForPhoto(date, false);
    return (
      <div className="feed__userContent__textDate" title={detailedDate}>
        {formattedDate}
      </div>
    );
  };

  const hasUserLiked = (photo: Photo): boolean => (photo
    ? !(!photo.likes.find((like) => like.user.id === userData.id))
    : false);

  const linkToPhoto = (photo: Photo): string => `/${photo.author.username}/${photo.id}`;
  return (
    <DefaultMain errorText={errorText} clearError={clearError}>
      <div className="feed">
        {feedPhotos.map((photo, i) => (
          <div key={photo.id} className="feed__item">
            <div className="feed__userContainer">
              <div className="feed__userContent">
                <div
                  className="feed__userContent__avatar"
                  style={{
                    backgroundImage: `url(${photo.author.profilePhoto
                      ? photo.author.profilePhoto.imageString
                      : EmptyProfilePic})`,
                  }}
                />
                <div className="feed__userContent__text">
                  <Link
                    to={`/${photo.author.username}`}
                    style={{ textDecoration: "none" }}
                  >
                    {photo.author.username}
                  </Link>
                  <br />
                  {printPhotoDate(photo.publishDate)}
                </div>
              </div>
            </div>
            <div className="feed__photoContainer">
              <div className="feed__photoContent">
                <Link
                  to={linkToPhoto(photo)}
                >
                  <div
                    className="feed__photoContent__photo"
                    style={{
                      backgroundImage: `url(${photo.imageString})`,
                    }}
                  />
                </Link>
                <div className="feed__photoContent__likes">
                  <div className="feed__photoContent__likes__button">
                    {hasUserLiked(photo) ? (
                      <FavoriteIcon
                        style={likeIcon}
                        onClick={() => handleToggleLike(photo)}
                      />
                    ) : (
                      <FavoriteBorderIcon
                        style={likeIcon}
                        onClick={() => handleToggleLike(photo)}
                      />
                    )}
                  </div>
                  <div className="feed__photoContent__likes__likers">
                    {RenderLikers(photo.likes, photo.likesCount)}
                  </div>
                </div>
                <div className="feed__photoContent__comments">
                  <div style={{ padding: "5px 10px" }}>
                    <Link to={linkToPhoto(photo)} style={{ textDecoration: "none" }}>
                      {photo.commentsCount === 0
                        ? (
                          <span>No comments yet. Be first to comment!</span>
                        ) : (
                          <span>{`View ${photo.commentsCount} comments`}</span>
                        )}
                    </Link>
                  </div>
                </div>
              </div>
              {i !== (feedPhotos.length - 1)
                ? (
                  <hr />
                ) : (
                  null
                )}
            </div>
            <div className="feed__emptyContainer" />
          </div>
        ))}
      </div>
    </DefaultMain>
  );
};

export default Main;
