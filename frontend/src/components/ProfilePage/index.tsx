import React, { useState } from "react";
import { useParams } from "react-router-dom";
import AppBar from "../AppBar";
import ProfilePageContent from "./ProfilePageContent";
import ProfilePageTop from "./ProfilePageTop";
import "../../styles/ProfilePage.css";

import test_cover from "../../assets/placeholders/cover_photo.jpg";

const ProfilePage = () => {
  const username = useParams().userId;
  const [coverPhotoEnabled, setCoverPhoto] = useState<boolean>(false);
  if (!username) {
    return <div>404</div>;
  }

  const toggleCoverPhoto = () => setCoverPhoto(!coverPhotoEnabled);

  const root = document.querySelector(":root") as HTMLElement;
  root.style.setProperty("--minProfileCoverPhotoHeight", coverPhotoEnabled
    ? "var(--profileDefaultCoverPhotoHeight)" : "var(--profileEmptyCoverPhotoHeight)");
  root.style.setProperty("--profileBackgroundHeight", coverPhotoEnabled
    ? "var(--profileBackgroundHeightFormula)" : "var(--profileBackgroundHeightWithoutCoverPhoto)");
  root.style.setProperty("--profileBackgroundMaxHeight", coverPhotoEnabled
    ? "var(--profileBackgroundMaxHeightFormula)" : "var(--profileBackgroundHeightWithoutCoverPhoto)");

  return (
    <div>
      <AppBar />
      <div className="profilePage__background">
        <div className="profilePage__background__topMargin" />
        <div className="profilePage__background__coverPhoto">
          {coverPhotoEnabled && (<img src={test_cover} alt="" />)}
        </div>
      </div>

      <div className="profilePage__container">
        <ProfilePageTop username={username} />
        <ProfilePageContent coverPhotoFunc={toggleCoverPhoto} />
      </div>
    </div>
  );
};

export default ProfilePage;
