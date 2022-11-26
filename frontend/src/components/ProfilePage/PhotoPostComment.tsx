/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from "react";
import { Form, Formik } from "formik";
import CircularProgress from "@mui/material/CircularProgress";
import SendIcon from "@mui/icons-material/Send";
import EmptyProfilePic from "../../assets/empty_profile.png";
import { Photo } from "../../types";
import { getUserData } from "../../utils/userdata";

interface CommentProps {
  photo: Photo,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PhotoComments = ({ photo }: CommentProps) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const userData = getUserData()!;

  const postComment = async () => {
    console.log("foo");
  };

  const toggleUploading = () => setUploading(!uploading);

  return (
    <Formik
      initialValues={{ comment: "" }}
      onSubmit={postComment}
    >
      {() => (
        <Form className="form ui photoModal__textFlex__item photoModal__commentFlex">
          <div
            className="photoModal__avatar photoModal__commentFlex__avatar"
            onClick={toggleUploading}
            onKeyDown={toggleUploading}
            style={{
              backgroundImage: `url(${userData.profilePhoto
                ? userData.profilePhoto
                : EmptyProfilePic})`,
            }}
          />
          <input
            type="text"
            name="comment"
            className="photoModal__commentFlex__input"
          />
          <div className="photoModal__commentFlex__buttonFlex">
            {!uploading ? (
              <SendIcon
                color="primary"
                fontSize="small"
                onClick={() => console.log("test")}
              />
            ) : (
              <CircularProgress
                size="17px"
              />
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PhotoComments;
