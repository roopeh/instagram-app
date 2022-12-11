import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Accounts from "./components/Accounts";
import Login from "./components/Login";
import Main from "./components/Main";
import ProfilePage from "./components/ProfilePage";
import Register from "./components/Register";
import NotFound from "./components/NotFound";
import "./styles/shared.css";
import "./styles/App.css";
import Messages from "./components/Messages";

const App = () => {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      return () => null;
    }

    const handleContextMenu = (e: MouseEvent) => { e.preventDefault(); };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  return (
    <div className="background">
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/accounts/register" element={<Register />} />
        <Route path="/accounts/login" element={<Login />} />
        <Route path="/accounts/messages" element={<Messages />} />
        <Route path="/accounts/*" element={<NotFound />} />
        <Route path="/notfound" element={<NotFound />} />
        <Route path="/:userId/*" element={<ProfilePage />} />
      </Routes>
    </div>
  );
};

export default App;
