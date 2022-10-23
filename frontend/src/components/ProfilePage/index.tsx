import React from "react";
import { useParams } from "react-router-dom";
import ProfilePageContent from "./ProfilePageContent";
import ProfilePageTop from "./ProfilePageTop";

const ProfilePage = () => {
  const username = useParams().userId;
  if (!username) {
    return <div>404</div>;
  }

  const root = document.querySelector(":root") as HTMLElement;
  root.style.setProperty("--profileCoverPhotoHeight", "400px");
  return (
    <div>
      <div className="profileBackground" />
      <div className="profileCoverPhoto" />

      <div className="profileContainer">
        <ProfilePageTop username={username} />
        <ProfilePageContent />
      </div>
    </div>
  );
};

export default ProfilePage;
