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
    return <NotFound />;
  }

  const getUserQuery = useGetUser({ username });
  if (getUserQuery.error) {
    return <NotFound />;
  }

  if (!getUserQuery.user) {
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
              user={undefined}
            />
            <div className="profilePage__loading">
              Loading...
            </div>
          </div>
        </div>
      );
    }

    return <NotFound />;
  }

  const userInfo = getUserQuery.user;
  if (!coverPhotoEnabled && userInfo.coverPhoto) {
    // Set cover photo only once
    setCoverPhoto(true);
    return null;
  }
  if (coverPhotoEnabled && !userInfo.coverPhoto) {
    setCoverPhoto(false);
    return null;
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
          {coverPhotoEnabled && (<img src={userInfo.coverPhoto!.imageString} alt="" />)}
        </div>
      </div>

      <div className="profilePage__container">
        <ProfilePageTop
          user={userInfo}
        />
        <ProfilePageContent
          username={userInfo.username}
          photos={userInfo.photos}
          refetchProfile={() => getUserQuery.refetch()}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
