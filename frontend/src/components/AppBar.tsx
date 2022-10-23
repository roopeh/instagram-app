import React from "react";
import logo from "../assets/logo.png";

const AppBar = () => (
  <div className="appBar">
    <div className="appBar__content">
      <img src={logo} alt="Instagram" className="appBar__logo" />
      <span className="appBar__profile">
        profile
      </span>
    </div>
  </div>
);

export default AppBar;
