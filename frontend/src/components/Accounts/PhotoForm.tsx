import React, { useState } from "react";
import { Form, Formik } from "formik";
import { Button, IconButton } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import useSetProfilePicture from "../../hooks/useSetProfilePicture";
import getBase64 from "../../utils/getBase64";
import { getUserData, saveUserData } from "../../utils/userdata";

interface FileInfo {
  name: string,
  file: File,
}

interface PhotoFormProps {
  title: string,
  isCoverPhoto: boolean,
}

const PhotoForm = ({ title, isCoverPhoto }: PhotoFormProps) => {
  const [imageFile, setImageFile] = useState<FileInfo | null>(null);
  const [errorText, setErrorText] = useState<string>("");
  const [setProfilePicture] = useSetProfilePicture();

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

    const base64 = await getBase64(imageFile.file);

    try {
      const { data } = await setProfilePicture({
        type: imageFile.file.type,
        size: imageFile.file.size,
        base64,
      });
      if (data && data.setProfilePicture) {
        saveUserData({
          ...userData,
          profilePhoto: data.setProfilePicture,
        });
      }
      setImageFile(null);
    } catch (err) {
      setErrorText(String(err));
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
            </IconButton>
            <span className="accounts__imageUploadFlex__fileName">
              {imageFile ? imageFile.name : <i>Choose image</i>}
            </span>
            <br />
            <Button
              type="submit"
              variant="contained"
              size="small"
              style={{ marginTop: "10px" }}
            >
              Upload
            </Button>
            <br />
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
                    src={userData.coverPhoto}
                  />
                )
              ) : (
                userData.profilePhoto && (
                  <img
                    alt="profile pic"
                    className="accounts__imageUploadFlex__profilePhoto"
                    src={userData.profilePhoto}
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
