import React from "react";
import { Link } from "react-router-dom";
import AppBar from "./AppBar";

const NotFound = () => (
  <div className="main">
    <AppBar />
    <div className="notFound__container">
      <div className="notFound__content">
        <h2>Sorry, this page isn&apos;t available.</h2>
        The link you followed may be broken, or the page may have been removed.&nbsp;
        <Link to="/" style={{ textDecoration: "none" }}>Go back to Instagram.</Link>
      </div>
    </div>
  </div>
);

export default NotFound;
