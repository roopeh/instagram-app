import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ProfilePageContent from "./ProfilePageContent";
import ProfilePageTop from "./ProfilePageTop";
import "../../styles/ProfilePage.css";

const ProfilePage = () => {
  const username = useParams().userId;
  const [coverPhotoEnabled, setCoverPhoto] = useState<boolean>(false);
  if (!username) {
    return <div>404</div>;
  }

  const toggleCoverPhoto = () => setCoverPhoto(!coverPhotoEnabled);

  const root = document.querySelector(":root") as HTMLElement;
  root.style.setProperty("--profileCoverPhotoHeight", coverPhotoEnabled ? "400px" : "80px");

  return (
    <div>
      <div className="profilePage__background" />
      <div className="profilePage__coverPhoto" />

      <div className="profilePage__container">
        <ProfilePageTop username={username} />
        <ProfilePageContent coverPhotoFunc={toggleCoverPhoto} />
      </div>
    </div>
  );
};

export default ProfilePage;
