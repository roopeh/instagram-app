import React from "react";
import { Route, Routes } from "react-router-dom";
import AppBar from "./components/AppBar";
import ProfilePage from "./components/ProfilePage";
import "./styles/shared.css";
import "./styles/App.css";

// eslint-disable-next-line arrow-body-style
const App = () => {
  return (
    <div className="background">
      <AppBar />
      <Routes>
        <Route path="/" element={<div>Hello from main!</div>} />
        <Route path="/:userId/*" element={<ProfilePage />} />
      </Routes>
    </div>
  );
};

export default App;
