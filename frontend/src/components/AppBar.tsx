import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import EmptyProfilePic from "../assets/empty_profile.png";
import LoginModal from "./Login/LoginModal";
import "../styles/AppBar.css";

import Musk from "../assets/placeholders/musk.jpg";

const AppBar = () => {
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const loggedIn: boolean = false;

  const toggleLoginModal = (toggle: boolean): void => {
    setLoginModalOpen(toggle);
  };

  return (
    <div className="appBar">
      <div className="appBar__content">
        <Link to="/">
          <img src={Logo} alt="Instagram" className="appBar__logo" />
        </Link>
        {loggedIn
          ? (
            <div className="appBar__profile" aria-hidden="true">
              <img src={Musk} alt="" className="appbar__profile__profilePicture" />
              profile
            </div>
          ) : (
            <div className="appBar__profile" aria-hidden="true" onClick={() => toggleLoginModal(true)}>
              <img src={EmptyProfilePic} alt="" className="appbar__profile__defaultProfilePicture" />
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
