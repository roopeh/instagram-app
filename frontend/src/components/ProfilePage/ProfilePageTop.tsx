import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FollowModal from "./FollowModal";
import FollowButton from "./FollowButton";
import EmptyProfilePic from "../../assets/empty_profile.png";
import { getUserData, saveUserData } from "../../utils/userdata";
import { User } from "../../types";
import useFollowUser from "../../hooks/useFollowUser";
import ErrorModal from "../ErrorModal";
import { useLazyMe } from "../../hooks/useMe";

interface ProfileTopProps {
  user: Omit<User, "photos" | "coverPhoto"> | undefined,
  refetchFunc: () => Promise<void>,
}

type FollowModalType = "Following" | "Followers";

const ProfilePageTop = ({ user, refetchFunc }: ProfileTopProps) => {
  const [followModalOpen, setFollowModalOpen] = useState<boolean>(false);
  const [followModalType, setFollowModalType] = useState<FollowModalType>("Following");
  const [errorText, setErrorText] = useState<string>("");
  const [followUser] = useFollowUser();
  const {
    getMe, me: meData, error: meError, loading: meLoading,
  } = useLazyMe();
  const navigate = useNavigate();

  // Used to force a rerender
  const [, setTmpUsrData] = useState<User | null>(null);

  const {
    id, username, firstName, lastName, bioText, profilePhoto, photoCount,
    following, followingCount, followers, followersCount,
  } = { ...user };

  useEffect(() => {
    if (followModalOpen) {
      setFollowModalOpen(false);
    }
  }, [id]);

  useEffect(() => {
    if (!meError && !meLoading && meData) {
      saveUserData(meData);
      setTmpUsrData(meData);
    }
  }, [meData, meError, meLoading]);

  const openFollowingModal = () => {
    if (!user || !following) {
      return;
    }
    setFollowModalType("Following");
    setFollowModalOpen(true);
  };

  const openFollowersModal = () => {
    if (!user || !followers) {
      return;
    }
    setFollowModalType("Followers");
    setFollowModalOpen(true);
  };

  const handleFollowUser = async (userId: string): Promise<void> => {
    try {
      await followUser({ userId });
      if (id !== userId) {
        // If followed from another profile's follow modal,
        // profile data is not updated without refetching
        refetchFunc();
      }
      await getMe();
    } catch (err) {
      setErrorText(String(err));
    }
  };

  const closeFollowModal = () => {
    setFollowModalOpen(false);
  };

  const userData = getUserData();
  const renderProfileButton: boolean = userData !== null && !!username && username.length > 0;
  const isFollowing: User | null | undefined = renderProfileButton && followers
    ? followers.find((itr) => itr.id === userData!.id)
    : null;

  return (
    <div className="profilePage__topBar">
      <FollowModal
        title={followModalType}
        data={followModalType === "Followers" ? followers || [] : following || []}
        showFollowButton={renderProfileButton}
        follow={handleFollowUser}
        openBoolean={followModalOpen}
        closeModal={closeFollowModal}
      />
      <ErrorModal
        text={errorText}
        openBoolean={errorText.length > 0}
        buttonText="Close"
        onClose={() => setErrorText("")}
      />
      <div
        className="profilePage__profilePicture"
        style={renderProfileButton ? { paddingBottom: "11px" } : {}}
      >
        <div className="profilePage__profilePicture__picture">
          <img
            src={profilePhoto ? profilePhoto.imageString : EmptyProfilePic}
            alt=""
            style={
              !profilePhoto ? { backgroundColor: "var(--borderColorLight" } : {}
            }
          />
        </div>
        <div>
          {renderProfileButton && (
            <FollowButton
              userId={id!}
              loggedUserId={userData!.id}
              isFollowing={!!isFollowing}
              showProfileButton
              editProfile={() => navigate("/accounts")}
              follow={handleFollowUser}
              buttonStyle={{
                width: "100px", marginTop: "5px", fontSize: "9px", fontWeight: "600",
              }}
            />
          )}
        </div>
      </div>
      <div className="profilePage__topBar__textFlexBox">
        <div className="profilePage__topBar__textContainer">
          <span className="strongerFont">
            {username || ""}
          </span>
          <div className="profilePage__topBar__textContainer__userInfo">
            <span className="smallerButBoldedFont" style={{ paddingRight: "10px" }}>
              {`${firstName || ""} ${lastName || ""}`}
            </span>
            <br />
            <span className="smallerGrayedFont">
              {bioText}
            </span>
          </div>
        </div>
        <div className="profilePage__buttonsOuterBox">
          <div className="profilePage__buttonsFlexBox">
            <div className="profilePage__buttonsFlexBox__textBox">
              <div className="profilePage__buttonsFlexBox__number">{photoCount || 0}</div>
              <div className="profilePage__buttonsFlexBox__label">photos</div>
            </div>
            <div
              className="profilePage__buttonsFlexBox__textBox"
              onClick={openFollowingModal}
              aria-hidden
              style={{ cursor: "pointer" }}
            >
              <div className="profilePage__buttonsFlexBox__number">{followingCount || 0}</div>
              <div className="profilePage__buttonsFlexBox__label">following</div>
            </div>
            <div
              className="profilePage__buttonsFlexBox__textBox"
              onClick={openFollowersModal}
              aria-hidden
              style={{ border: 0, cursor: "pointer" }}
            >
              <div className="profilePage__buttonsFlexBox__number">{followersCount || 0}</div>
              <div className="profilePage__buttonsFlexBox__label">followers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageTop;
