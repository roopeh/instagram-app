import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import RegisterModal from "./Register/RegisterModal";
import "../styles/AppBar.css";

const AppBar = () => {
  const [registerModalOpen, setRegisterModalOpen] = useState<boolean>(false);

  const toggleRegisterModal = (toggle: boolean): void => {
    setRegisterModalOpen(toggle);
  };

  return (
    <div className="appBar">
      <div className="appBar__content">
        <Link to="/">
          <img src={logo} alt="Instagram" className="appBar__logo" />
        </Link>
        <span className="appBar__profile" aria-hidden="true" onClick={() => toggleRegisterModal(true)}>
          profile
        </span>
        <RegisterModal
          openBoolean={registerModalOpen}
          hideCancelButton={false}
          titleText="Register"
          showLogo={false}
          onClose={() => toggleRegisterModal(false)}
        />
      </div>
    </div>
  );
};

export default AppBar;
