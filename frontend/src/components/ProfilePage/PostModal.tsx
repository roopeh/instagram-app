import React, { useState, useEffect } from "react";
import { ApolloQueryResult } from "@apollo/client";
import * as yup from "yup";
import { Form, Formik } from "formik";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "../LoadingButton";
import ErrorModal from "../ErrorModal";
import FormikTextInput from "../FormikTextInput";
import useCreatePost from "../../hooks/useCreatePost";
import EmptyProfilePic from "../../assets/empty_profile.png";
import { getUserData } from "../../utils/userdata";
import getBase64 from "../../utils/getBase64";
import { FileInfo } from "../../types";
import "../../styles/PostModal.css";

interface PostProps {
  open: boolean,
  onClose: () => void,
  refetchProfile: () => Promise<ApolloQueryResult<any>>,
}

type Base64Info = {
  base64: string,
};

type Base64FileInfo = FileInfo & Base64Info;

const PostModal = ({ open, onClose, refetchProfile }: PostProps) => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth * 0.8);
  const [imageFile, setImageFile] = useState<Base64FileInfo | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const [imageError, setImageError] = useState<boolean>(false);
  const [createPost] = useCreatePost();
  const userData = getUserData()!;

  useEffect(() => {
    const handleResize: () => void = () => setWindowWidth(window.innerWidth * 0.8);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const root = document.querySelector(":root") as HTMLElement;
  const smallerThanThreshold: boolean = windowWidth < 500;

  root.style.setProperty("--postModalFlexDirection", smallerThanThreshold
    ? "column-reverse" : "row");
  root.style.setProperty("--postModalTextFlexDirection", smallerThanThreshold
    ? "row" : "column");
  root.style.setProperty("--postModalTextFlexContent", smallerThanThreshold
    ? "space-between" : "normal");
  root.style.setProperty("--postmodalProfilePicMargin", smallerThanThreshold
    ? "0 auto" : "0 10px 0 0");

  const smallerTextContainer: React.CSSProperties = {
    flex: 1, padding: "0 10px",
  };

  const closeModal = (): void => {
    setImageFile(null);
    setUploading(false);
    setErrorText("");
    setImageError(false);
    onClose();
  };

  const changeImageInput = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) {
      return;
    }

    const fileType = file.type.toLowerCase().split("/");
    if (fileType[0] !== "image") {
      setImageError(true);
      return;
    }

    const base64 = await getBase64(file);
    setImageFile({ name: file.name, file, base64 });
  };

  const uploadPost = async (values: any): Promise<void> => {
    setErrorText("");
    if (!imageFile) {
      setErrorText("Error: Image is required");
      return;
    }

    setUploading(true);
    try {
      const { data } = await createPost({
        type: imageFile.file.type,
        captionText: values.captionText,
        size: imageFile.file.size,
        base64: imageFile.base64,
      });
      if (data && data.createPost) {
        closeModal();
        refetchProfile();
      }
    } catch (err) {
      setErrorText(String(err));
      setUploading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => null}
    >
      <div className="postModal">
        <ErrorModal
          text="File must be an image file"
          openBoolean={imageError}
          buttonText="Ok"
          onClose={() => setImageError(false)}
        />
        <div className="postModal__topBar">
          <div style={{ flex: "1" }} />
          <div className="postModal__topBar__title">
            Create new post
          </div>
          <div className="postModal__topBar__closeButtonContainer">
            <CloseIcon
              onClick={closeModal}
              fontSize="large"
              style={{ opacity: "0.4", cursor: "pointer" }}
            />
          </div>
        </div>
        <Formik
          initialValues={{
            file: null,
            captionText: "",
          }}
          validationSchema={yup.object().shape({
            captionText: yup
              .string()
              .required("Caption text can't be empty"),
          })}
          onSubmit={uploadPost}
        >
          {() => (
            <Form className="form ui postModal__content">
              <div className={`${smallerThanThreshold ? "postModal__pictureSmaller" : "postModal__pictureDefault"}`}>
                <IconButton
                  color="primary"
                  aria-label="upload post"
                  component="label"
                  style={imageFile ? { display: "none" } : {}}
                >
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={changeImageInput}
                  />
                  <PhotoCamera />
                  <span className="accounts__imageUploadFlex__fileName">
                    {imageFile ? imageFile.name : <i>Choose image</i>}
                  </span>
                </IconButton>
                <img
                  src={imageFile ? imageFile.base64 : undefined}
                  alt=""
                  style={imageFile ? {} : { display: "none" }}
                />
              </div>
              <div className="postModal__textFlex">
                <div className="postModal__textFlex__username">
                  <img
                    src={userData.profilePhoto
                      ? userData.profilePhoto
                      : EmptyProfilePic}
                    alt=""
                    className="postModal__textFlex__profilePic"
                  />
                  <strong>{userData.username}</strong>
                </div>
                <div style={smallerThanThreshold ? smallerTextContainer : {}}>
                  <FormikTextInput
                    placeholder="Write a caption..."
                    name="captionText"
                    type="input"
                    size="small"
                    variant="standard"
                    multiline
                    rows={smallerThanThreshold ? 3 : 6}
                    style={{ width: "calc(100% - 15px * 2)", marginTop: "3vh" }}
                  />
                </div>
                <div>
                  <LoadingButton
                    variant="contained"
                    uploading={uploading}
                    size="small"
                    buttonText="Create post"
                    style={{ marginTop: "50px" }}
                  />
                </div>
                <div className="errorText" style={{ marginTop: "15px" }}>
                  {errorText}
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default PostModal;
