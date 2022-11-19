import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useGetUser from "../../hooks/useGetUser";
import AppBar from "../AppBar";
import NotFound from "../NotFound";
import ProfilePageContent from "./ProfilePageContent";
import ProfilePageTop from "./ProfilePageTop";
import "../../styles/ProfilePage.css";

const ProfilePage = () => {
  const [coverPhotoEnabled, setCoverPhoto] = useState<boolean>(false);
  const username = useParams().userId;
  if (!username) {
    return <div>404</div>;
  }

  const getUserQuery = useGetUser({ username });
  if (getUserQuery.error || (!getUserQuery.user && !getUserQuery.loading)) {
    return <NotFound />;
  }
  if (getUserQuery.loading) {
    return (
      <div>
        <AppBar />
        <div className="profilePage__background">
          <div className="profilePage__background__topMargin" />
          <div className="profilePage__background__coverPhoto" />
        </div>

        <div className="profilePage__container">
          <ProfilePageTop
            username=""
            firstName=""
            lastName=""
            bioText=""
            profilePhoto=""
            photoCount={0}
            followingCount={0}
            followersCount={0}
          />
          <div className="profilePage__loading">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  const userInfo = getUserQuery.user;

  // Set cover photo only once
  if (!coverPhotoEnabled && userInfo.coverPhoto) {
    setCoverPhoto(userInfo.coverPhoto);
  }

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
          {coverPhotoEnabled && (<img src={userInfo.coverPhoto.imageString} alt="" />)}
        </div>
      </div>

      <div className="profilePage__container">
        <ProfilePageTop
          username={userInfo.username}
          firstName={userInfo.firstName}
          lastName={userInfo.lastName}
          bioText={userInfo.bioText}
          profilePhoto={userInfo.profilePhoto ? userInfo.profilePhoto.imageString : ""}
          photoCount={userInfo.photoCount}
          followingCount={userInfo.followingCount}
          followersCount={userInfo.followersCount}
        />
        <ProfilePageContent coverPhotoFunc={() => null} />
      </div>
    </div>
  );
};

export default ProfilePage;
