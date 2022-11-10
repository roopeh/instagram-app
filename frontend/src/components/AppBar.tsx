import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import EmptyProfilePic from "../assets/empty_profile.png";
import LoginModal from "./Login/LoginModal";
import { getUserData } from "../utils/userdata";
import "../styles/AppBar.css";

const AppBar = () => {
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  // Get user data from local storage
  const userData = getUserData();

  const toggleLoginModal = (toggle: boolean): void => {
    setLoginModalOpen(toggle);
  };

  return (
    <div className="appBar">
      <div className="appBar__content">
        <Link to="/">
          <img src={Logo} alt="Instagram" className="appBar__logo" />
        </Link>
        {userData
          ? (
            <div className="appBar__profile" aria-hidden="true" onClick={() => navigate("/accounts")}>
              <img
                src={userData.profilePhoto
                  ? userData.profilePhoto
                  : EmptyProfilePic}
                alt=""
                className={userData.profilePhoto
                  ? "appBar__profile__profilePicture"
                  : "appBar__profile__defaultProfilePicture"}
              />
              {userData.username}
            </div>
          ) : (
            <div className="appBar__profile" aria-hidden="true" onClick={() => toggleLoginModal(true)}>
              <img src={EmptyProfilePic} alt="" className="appBar__profile__defaultProfilePicture" />
              Login
            </div>
          )}
        <LoginModal
          openBoolean={loginModalOpen}
          titleText="Login"
          showLogo={false}
          onClose={() => toggleLoginModal(false)}
        />
      </div>
    </div>
  );
};

export default AppBar;
