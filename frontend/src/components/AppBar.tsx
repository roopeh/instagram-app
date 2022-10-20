import React from "react";
import logo from "../assets/logo.png";

const AppBar = () => (
  <div className="appBar">
    <div className="content">
      <img src={logo} alt="Instagram" className="logo" />
      <span className="profile">
        profile
      </span>
    </div>
  </div>
);

export default AppBar;
