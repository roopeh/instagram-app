import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import LoginModal from "./Login/LoginModal";
import "../styles/AppBar.css";

const AppBar = () => {
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);

  const toggleLoginModal = (toggle: boolean): void => {
    setLoginModalOpen(toggle);
  };

  return (
    <div className="appBar">
      <div className="appBar__content">
        <Link to="/">
          <img src={logo} alt="Instagram" className="appBar__logo" />
        </Link>
        <span className="appBar__profile" aria-hidden="true" onClick={() => toggleLoginModal(true)}>
          profile
        </span>
        <LoginModal
          openBoolean={loginModalOpen}
          hideCancelButton={false}
          titleText="Login"
          showLogo={false}
          onClose={() => toggleLoginModal(false)}
        />
      </div>
    </div>
  );
};

export default AppBar;
