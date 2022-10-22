import React from "react";
import AppBar from "./components/AppBar";
import ProfilePage from "./components/ProfilePage";
import "./styles/index.css";

// eslint-disable-next-line arrow-body-style
const App = () => {
  return (
    <div className="background">
      <AppBar />
      <ProfilePage />
    </div>
  );
};

export default App;
