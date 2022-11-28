import React, { useEffect, useState } from "react";
import { ApolloQueryResult } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import CloseIcon from "@mui/icons-material/Close";
import PhotoLikes from "./PhotoLikes";
import PhotoPostComment from "./PhotoPostComment";
import PhotoItem from "./PhotoItem";
import PhotoComments from "./PhotoComments";
import ErrorModal from "../ErrorModal";
import { useGetPhoto, useGetPhotoComments } from "../../hooks/useGetPhoto";
import useDeletePost from "../../hooks/useDeletePost";
import { getUserData } from "../../utils/userdata";
import { Comment } from "../../types";
import "../../styles/PhotoModal.css";

interface PhotoModalProps {
  username: string,
  refetchProfile: () => Promise<ApolloQueryResult<any>>,
}

const PhotoModal = ({ username, refetchProfile }: PhotoModalProps) => {
  const [comments, setComments] = useState<Array<Comment>>([]);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth * 0.8);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const navigate = useNavigate();
  const { photoId } = useParams();

  const getPhotoQuery = useGetPhoto({ username, photoId });
  const getCommentsQuery = useGetPhotoComments({ username, photoId });
  const [deletePost] = useDeletePost();

  useEffect(() => {
    if ((!photoId || getPhotoQuery.error || getCommentsQuery.error)
    || (!getPhotoQuery.photo && !getPhotoQuery.loading)
    || (!getCommentsQuery.photo && !getCommentsQuery.loading)) {
      navigate("/notfound");
    }
  }, [
    navigate, photoId, getPhotoQuery.error, getPhotoQuery.photo, getPhotoQuery.loading,
    getCommentsQuery.error, getCommentsQuery.photo, getCommentsQuery.loading,
  ]);

  useEffect(() => {
    if (getCommentsQuery.error || (!getCommentsQuery.photo && !getCommentsQuery.loading)) {
      navigate("/notfound");
    }
    // Load comments when page is fully rendered
    // so modal won't hang when there are over 100 comments
    // TODO: pagination
    if (getCommentsQuery.photo) {
      setComments(getCommentsQuery.photo.comments);
    }
  }, [getCommentsQuery.error, getCommentsQuery.photo]);

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
  const isOwnPage: boolean = userData ? userData.username === photo.author.username : false;

  const root = document.querySelector(":root") as HTMLElement;
  const smallerThanThreshold: boolean = windowWidth < 700;

  root.style.setProperty("--photoModalFlexDirection", smallerThanThreshold
    ? "column" : "row");
  root.style.setProperty("--photoModalLikeFlexSize", smallerThanThreshold
    ? "12%" : "40%");

  const handleError = (err: string): void => {
    setErrorText(err);
  };

  const closeModal = (): void => {
    navigate(-1);
  };

  const confirmDelete = async (): Promise<void> => {
    setConfirmDialogOpen(false);
    try {
      closeModal();
      await deletePost({ photoId: photo.id });
      refetchProfile();
    } catch (err) {
      handleError(String(err));
    }
  };

  return (
    <Modal
      open
      onClose={closeModal}
      style={{ overflow: "scroll" }}
    >
      <div className="photoModal">
        <ErrorModal
          text={errorText}
          openBoolean={errorText.length > 0}
          buttonText="Close"
          onClose={() => setErrorText("")}
        />
        <Dialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
        >
          <DialogContent>Are you sure you want to delete this picture?</DialogContent>
          <DialogActions>
            <Button
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color="error"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <div
          className={smallerThanThreshold ? "photoModal__imageFlexSmaller" : "photoModal__imageFlex"}
          style={{ backgroundImage: `url(${photo.imageString})` }}
        >
          <div className="photoModal__imageFlex__buttonFlex">
            <div
              className="photoModal__button__flex"
              onClick={closeModal}
              aria-hidden
            >
              <CloseIcon style={{ color: "white", width: "15px", height: "15px" }} />
            </div>
            {isOwnPage && (
              <div
                className="photoModal__button__flex"
                onClick={() => setConfirmDialogOpen(true)}
                aria-hidden
              >
                <DeleteIcon style={{ color: "white", width: "25px", height: "25px" }} />
              </div>
            )}
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
            <PhotoLikes
              username={username}
              photoId={photoId!}
              smallerThanThreshold={smallerThanThreshold}
              setError={handleError}
            />
          </div>
          {!smallerThanThreshold && (
            <PhotoItem
              author={photo.author}
              content={photo.captionText}
              unixDate={photo.publishDate}
            />
          )}
          <div className="photoModal__comments">
            <PhotoComments comments={comments} />
          </div>
          {userData && (
            <PhotoPostComment
              photo={photo}
              refetchFunc={getCommentsQuery.refetch}
              setError={handleError}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PhotoModal;
