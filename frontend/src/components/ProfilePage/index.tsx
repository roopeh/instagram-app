import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useGetUser from "../../hooks/useGetUser";
import AppBar from "../AppBar";
import NotFound from "../NotFound";
import ProfilePageContent from "./ProfilePageContent";
import ProfilePageTop from "./ProfilePageTop";
import "../../styles/ProfilePage.css";
import { User } from "../../types";

interface DefaultProps {
  user: User | undefined,
  hasCoverPhoto: boolean,
  refetchFunc: () => Promise<void>,
}

const DefaultProfilePage = ({ user, hasCoverPhoto, refetchFunc }: DefaultProps) => {
  const showCoverPhoto = !!user && hasCoverPhoto;
  return (
    <div>
      <AppBar />
      <div className="profilePage__background">
        <div className="profilePage__background__topMargin" />
        <div className="profilePage__background__coverPhoto">
          {showCoverPhoto && (<img src={user.coverPhoto.imageString} alt="" />)}
        </div>
      </div>

      <div className="profilePage__container">
        <ProfilePageTop user={user} refetchFunc={refetchFunc} />
        {!user
          ? (
            <div className="profilePage__loading">
              Loading...
            </div>
          ) : (
            <ProfilePageContent
              username={user.username}
              photos={user.photos}
            />
          )}
      </div>
    </div>
  );
};

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

  const handleProfileRefetch = async () => {
    await getUserQuery.refetch();
  };

  if (!getUserQuery.user) {
    if (getUserQuery.loading) {
      return (
        <DefaultProfilePage
          user={undefined}
          hasCoverPhoto={false}
          refetchFunc={handleProfileRefetch}
        />
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
    <DefaultProfilePage
      user={userInfo}
      hasCoverPhoto={coverPhotoEnabled}
      refetchFunc={handleProfileRefetch}
    />
  );
};

export default ProfilePage;
