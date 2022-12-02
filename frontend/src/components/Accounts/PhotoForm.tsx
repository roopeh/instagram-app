import React, { useState } from "react";
import { Form, Formik } from "formik";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import LoadingButton from "../LoadingButton";
import useSetProfilePicture from "../../hooks/useSetProfilePicture";
import useSetCoverPicture from "../../hooks/useSetCoverPicture";
import { FileInfo } from "../../types";
import getBase64 from "../../utils/getBase64";
import { getUserData, saveUserData } from "../../utils/userdata";

interface PhotoFormProps {
  title: string,
  isCoverPhoto: boolean,
}

const PhotoForm = ({ title, isCoverPhoto }: PhotoFormProps) => {
  const [imageFile, setImageFile] = useState<FileInfo | null>(null);
  const [errorText, setErrorText] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [setProfilePicture] = useSetProfilePicture();
  const [setCoverPicture] = useSetCoverPicture();

  const userData = getUserData()!;

  const changeImageInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) {
      return;
    }

    setImageFile({ name: file.name, file });
  };

  const uploadPicture = async (): Promise<void> => {
    setErrorText("");
    if (!imageFile) {
      setErrorText("Error: Image is required");
      return;
    }

    setUploading(true);
    const base64 = await getBase64(imageFile.file);

    try {
      if (isCoverPhoto) {
        const { data } = await setCoverPicture({
          type: imageFile.file.type,
          captionText: "",
          size: imageFile.file.size,
          base64,
        });
        if (data && data.setCoverPicture) {
          saveUserData({
            ...userData,
            coverPhoto: data.setCoverPicture,
          });
        }
      } else {
        const { data } = await setProfilePicture({
          type: imageFile.file.type,
          captionText: "",
          size: imageFile.file.size,
          base64,
        });
        if (data && data.setProfilePicture) {
          saveUserData({
            ...userData,
            profilePhoto: data.setProfilePicture,
          });
        }
      }
      setImageFile(null);
      setUploading(false);
    } catch (err) {
      setErrorText(String(err));
      setUploading(false);
    }
  };

  return (
    <>
      <h4>{title}</h4>
      <Formik
        initialValues={{ file: null }}
        onSubmit={uploadPicture}
      >
        {() => (
          <Form className="form ui">
            <IconButton
              color="primary"
              aria-label={isCoverPhoto
                ? "upload cover picture"
                : "upload profile picture"}
              component="label"
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
            <br />
            <LoadingButton
              variant="contained"
              size="small"
              uploading={uploading}
              buttonText="Upload"
              style={{ marginTop: "10px" }}
            />
            {errorText && (
              <div className="errorText" style={{ marginTop: "15px" }}>
                {errorText}
              </div>
            )}
            <br />
            {isCoverPhoto
              ? (
                userData.coverPhoto && (
                  <img
                    alt="cover pic"
                    className="accounts__imageUploadFlex__coverPhoto"
                    src={userData.coverPhoto.imageString}
                  />
                )
              ) : (
                userData.profilePhoto && (
                  <img
                    alt="profile pic"
                    className="accounts__imageUploadFlex__profilePhoto"
                    src={userData.profilePhoto.imageString}
                  />
                )
              )}
          </Form>
        )}
      </Formik>
    </>
  );
};

export default PhotoForm;
