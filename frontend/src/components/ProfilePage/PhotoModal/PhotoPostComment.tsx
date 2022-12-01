import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import EmptyProfilePic from "../../../assets/empty_profile.png";
import useAddComment from "../../../hooks/useAddComment";
import { Photo } from "../../../types";
import { getUserData } from "../../../utils/userdata";

interface CommentProps {
  photo: Photo,
  setError: (err: string) => void,
}

const PhotoComments = ({ photo, setError }: CommentProps) => {
  const [addComment] = useAddComment();
  const [uploading, setUploading] = useState<boolean>(false);
  const userData = getUserData()!;

  const postComment = async (values: any, { resetForm }: any) => {
    const { comment } = values;
    if (!comment || !comment.length) {
      return;
    }

    setUploading(true);

    try {
      await addComment({ photoId: photo.id, message: comment });
      setUploading(false);
    } catch (err) {
      setError(String(err));
      setUploading(false);
    }
    resetForm();
  };

  return (
    <Formik
      initialValues={{ comment: "" }}
      onSubmit={postComment}
    >
      {() => (
        <Form className="form ui photoModal__textFlex__item photoModal__commentFlex">
          <div
            className="photoModal__avatar photoModal__commentFlex__avatar"
            style={{
              backgroundImage: `url(${userData.profilePhoto
                ? userData.profilePhoto
                : EmptyProfilePic})`,
            }}
          />
          <Field
            type="input"
            name="comment"
            className="photoModal__commentFlex__input"
          />
          <div className="photoModal__commentFlex__buttonFlex">
            {!uploading ? (
              <IconButton type="submit" size="small">
                <SendIcon
                  color="primary"
                  fontSize="small"
                />
              </IconButton>
            ) : (
              <CircularProgress
                size="20px"
              />
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PhotoComments;
