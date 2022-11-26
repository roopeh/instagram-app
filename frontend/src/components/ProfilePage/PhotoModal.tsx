import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import CircularProgress from "@mui/material/CircularProgress";
// import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import PhotoPostComment from "./PhotoPostComment";
import PhotoItem from "./PhotoItem";
import useGetPhoto from "../../hooks/useGetPhoto";
import { getUserData } from "../../utils/userdata";
import "../../styles/PhotoModal.css";

interface PhotoModalProps {
  username: string,
}

const PhotoModal = ({ username }: PhotoModalProps) => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth * 0.8);
  const [comments, setComments] = useState<Array<number>>([]);
  const commentsBottom = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { photoId } = useParams();

  const getPhotoQuery = useGetPhoto({ username, photoId });

  useEffect(() => {
    if (!photoId || getPhotoQuery.error) {
      if (getPhotoQuery.error) console.log(getPhotoQuery.error);
      navigate("/notfound");
    }
    if (!getPhotoQuery.photo && !getPhotoQuery.loading) {
      navigate("/notfound");
    }
  }, [navigate, photoId, getPhotoQuery.error, getPhotoQuery.photo, getPhotoQuery.loading]);

  // Load comments when page is fully rendered
  // so modal won't hang when there are over 100 comments
  // TODO: pagination
  useEffect(() => {
    if (getPhotoQuery.photo) {
      const arr: Array<number> = [];
      [...Array(40)].map((e, i) => arr.push(i));
      setComments(arr);
    }
  }, [getPhotoQuery.photo]);

  // Scroll to bottom when comments are loaded
  useEffect(() => {
    commentsBottom.current?.scrollIntoView();
  }, [comments]);

  useEffect(() => {
    const handleResize: () => void = () => setWindowWidth(window.innerWidth * 0.8);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if ((!getPhotoQuery.photo && getPhotoQuery.loading) || !getPhotoQuery.photo) {
    return (
      <Modal
        open
        onClose={() => navigate(-1)}
      >
        <div className="photoModal__loading">
          <CircularProgress style={{ color: "var(--borderColorDark)" }} />
        </div>
      </Modal>
    );
  }

  const userData = getUserData();
  const { photo } = getPhotoQuery;
  const { likesCount } = photo;
  const isOwnPage: boolean = userData ? userData.username === photo.author.username : false;

  const root = document.querySelector(":root") as HTMLElement;
  const smallerThanThreshold: boolean = windowWidth < 700;

  root.style.setProperty("--photoModalFlexDirection", smallerThanThreshold
    ? "column" : "row");
  root.style.setProperty("--photoModalLikeFlexSize", smallerThanThreshold
    ? "12%" : "40%");

  const likeIcon: React.CSSProperties = {
    width: "calc(100% * 0.3)", aspectRatio: "1.0", color: "#0000EE",
  };

  // eslint-disable-next-line arrow-body-style
  const formatLikes = (like: number): string => {
    return like >= 1000 ? `${Math.sign(like) * Number((like / 1000).toFixed(1))}k` : like.toString();
  };

  return (
    <Modal
      open
      onClose={() => navigate(-1)}
      style={{ overflow: "scroll" }}
    >
      <div className="photoModal">
        <div
          className={smallerThanThreshold ? "photoModal__imageFlexSmaller" : "photoModal__imageFlex"}
          style={{ backgroundImage: `url(${photo.imageString})` }}
        >
          <div className="photoModal__imageFlex__deleteContainer" style={!isOwnPage ? { display: "none" } : {}}>
            <DeleteIcon fontSize="large" />
          </div>
        </div>
        <div className={smallerThanThreshold
          ? "photoModal__textFlex photoModal__textFlexSmaller" : "photoModal__textFlex"}
        >
          <div className="photoModal__topFlex">
            {smallerThanThreshold && (
              <PhotoItem
                author={photo.author}
                content={photo.captionText}
                unixDate={photo.publishDate}
                style={{ flex: "0 0 40%", borderBottom: "0px" }}
              />
            )}
            <div
              className="photoModal__topFlex__likeContainer"
              style={!smallerThanThreshold ? { borderLeft: "0px" } : {}}
            >
              <FavoriteBorderIcon style={likeIcon} />
              <span className="photoModal__topFlex__likeText">{formatLikes(likesCount)}</span>
            </div>
            <div className="photoModal__topFlex__likers">
              <div />
              <div />
            </div>
          </div>
          {!smallerThanThreshold && (
            <PhotoItem
              author={photo.author}
              content={photo.captionText}
              unixDate={photo.publishDate}
            />
          )}
          <div className="photoModal__comments">
            <table>
              <tbody>
                {comments.map((e, i) => {
                  const someVal = i + 1;
                  return (
                    <tr key={someVal}>
                      <td>
                        <PhotoItem
                          author={photo.author}
                          content={`${someVal}st comment`}
                          unixDate={0}
                          style={{ borderBottom: 0 }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div ref={commentsBottom} />
          </div>
          {userData && <PhotoPostComment photo={photo} />}
        </div>
      </div>
    </Modal>
  );
};

export default PhotoModal;
