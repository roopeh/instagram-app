import React from "react";
import { Route, Routes } from "react-router-dom";
import Accounts from "./components/Accounts";
import Login from "./components/Login";
import Main from "./components/Main";
import ProfilePage from "./components/ProfilePage";
import Register from "./components/Register";
import "./styles/shared.css";
import "./styles/App.css";

// eslint-disable-next-line arrow-body-style
const App = () => {
  return (
    <div className="background">
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/accounts/register" element={<Register />} />
        <Route path="/accounts/login" element={<Login />} />
        <Route path="/:userId/*" element={<ProfilePage />} />
      </Routes>
    </div>
  );
};

export default App;
