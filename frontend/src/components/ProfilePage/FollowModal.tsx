import React from "react";
import { Link } from "react-router-dom";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import EmptyProfilePic from "../../assets/empty_profile.png";
import { getUserData } from "../../utils/userdata";
import "../../styles/FollowModal.css";
import FollowButton from "./FollowButton";
import { User } from "../../types";

interface FollowModalProps {
  title: string,
  data: Array<User>,
  showFollowButton: boolean,
  follow: (userId: string) => Promise<void>,
  openBoolean: boolean,
  closeModal: () => void,
}

const FollowModal = ({
  title, data, showFollowButton, follow, openBoolean, closeModal,
}: FollowModalProps) => {
  const userData = getUserData()!;

  return (
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
          <table>
            <tbody>
              {data.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="followModal__item">
                      <Link to={`/${user.username}`}>
                        <div
                          className="followModal__item__avatar"
                          style={{
                            backgroundImage: `url(${user.profilePhoto
                              ? user.profilePhoto.imageString
                              : EmptyProfilePic})`,
                          }}
                        />
                      </Link>
                      <div className="followModal__item__textContainer">
                        <div
                          className="followModal__item__textContainer__username"
                        >
                          <Link
                            to={`/${user.username}`}
                            style={{ textDecoration: "none", color: "black" }}
                          >
                            {user.username}
                          </Link>
                        </div>
                        <div className="followModal__item__textContainer__personname">
                          {`${user.firstName} ${user.lastName}`}
                        </div>
                      </div>
                      {showFollowButton && (
                        <div>
                          <FollowButton
                            userId={user.id}
                            loggedUserId={userData.id}
                            isFollowing={false}
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
        </div>
      </div>
    </Modal>
  );
};

export default FollowModal;
