import React from "react";
import { Link } from "react-router-dom";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import EmptyProfilePic from "../../assets/empty_profile.png";
import { getUserData } from "../../utils/userdata";
import "../../styles/FollowModal.css";
import FollowButton from "./FollowButton";
import { User } from "../../types";

type ModalTitle = "Following" | "Followers";

interface FollowModalProps {
  title: ModalTitle,
  data: Array<User>,
  showFollowButton: boolean,
  follow: (userId: string) => Promise<void>,
  openBoolean: boolean,
  closeModal: () => void,
}

interface DefaultProps {
  openBoolean: boolean,
  closeModal: () => void,
  title: ModalTitle,
  children: any,
}

const DefaultFollowModal = ({
  openBoolean, closeModal, title, children,
}: DefaultProps) => (
  <Modal
    open={openBoolean}
    onClose={closeModal}
  >
    <div className="followModal">
      <div className="followModal__header">
        <div className="followModal__header__buttonContainer" />
        <div className="followModal__header__content">
          {title}
        </div>
        <div className="followModal__header__buttonContainer">
          <div
            onClick={closeModal}
            aria-hidden
            style={{ cursor: "pointer" }}
          >
            <CloseIcon style={{ color: "black", width: "20px", height: "20px" }} />
          </div>
        </div>
      </div>
      <div className="followModal__container">
        {children}
      </div>
    </div>
  </Modal>
);

const FollowModal = ({
  title, data, showFollowButton, follow, openBoolean, closeModal,
}: FollowModalProps) => {
  if (!data.length) {
    return (
      <DefaultFollowModal
        openBoolean={openBoolean}
        closeModal={closeModal}
        title={title}
      >
        <div className="followModal__empty">
          {title === "Followers"
            ? "User has no followers yet"
            : "User is not following anybody yet"}
        </div>
      </DefaultFollowModal>
    );
  }

  const userData = getUserData()!;
  const isFollowing = (user: User): boolean => {
    if (!userData || !user || !userData.following || !userData.following.length) {
      return false;
    }

    return !!userData.following.find((itr) => itr.id === user.id);
  };

  return (
    <DefaultFollowModal
      openBoolean={openBoolean}
      closeModal={closeModal}
      title={title}
    >
      <table>
        <tbody>
          {data.map((user) => (
            <tr key={user.id}>
              <td>
                <div className="default__userItem">
                  <Link to={`/${user.username}`}>
                    <div
                      className="default__userItem__avatar"
                      style={{
                        backgroundImage: `url(${user.profilePhoto
                          ? user.profilePhoto.imageString
                          : EmptyProfilePic})`,
                      }}
                    />
                  </Link>
                  <div className="default__userItem__textContainer">
                    <div
                      className="default__userItem__textContainer__username"
                    >
                      <Link
                        to={`/${user.username}`}
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        {user.username}
                      </Link>
                    </div>
                    <div className="default__userItem__textContainer__personname">
                      {`${user.firstName} ${user.lastName}`}
                    </div>
                  </div>
                  {showFollowButton && (
                  <div>
                    <FollowButton
                      userId={user.id}
                      loggedUserId={userData.id}
                      isFollowing={isFollowing(user)}
                      showProfileButton={false}
                      follow={follow}
                      buttonSize="small"
                      buttonStyle={{ fontSize: "11px" }}
                    />
                  </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DefaultFollowModal>
  );
};

export default FollowModal;
