import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import PersonIcon from "@mui/icons-material/Person";
import MessageIcon from "@mui/icons-material/Message";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import Logo from "../assets/logo.png";
import EmptyProfilePic from "../assets/empty_profile.png";
import LoginModal from "./Login/LoginModal";
import useLogout from "../hooks/useLogout";
import { getUserData } from "../utils/userdata";
import "../styles/AppBar.css";

const AppBar = () => {
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [logout] = useLogout();
  const navigate = useNavigate();

  // Get user data from local storage
  const userData = getUserData();

  const toggleLoginModal = (toggle: boolean): void => {
    setLoginModalOpen(toggle);
  };

  const toggleMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    if (menuOpen) {
      setAnchorElement(null);
      setMenuOpen(false);
    } else {
      setAnchorElement(event.currentTarget);
      setMenuOpen(true);
    }
  };

  const handleLogout = async (): Promise<void> => {
    await logout();
    navigate("/");
  };

  const handleClick = (page: string, value?: string): void => {
    setMenuOpen(false);
    switch (page) {
      case "logout":
        handleLogout();
        break;
      case "profile":
        navigate(`/${value}`);
        break;
      case "messages":
        navigate(`/accounts/${page}`);
        break;
      default:
        navigate(`/${page}`);
        break;
    }
  };

  return (
    <div className="appBar">
      <div className="appBar__content">
        <Link to="/">
          <img src={Logo} alt="Instagram" className="appBar__logo" />
        </Link>
        {userData
          ? (
            <>
              <div className="appBar__profile" aria-hidden="true" onClick={toggleMenu}>
                <img
                  src={userData.profilePhoto
                    ? userData.profilePhoto
                    : EmptyProfilePic}
                  alt=""
                  className={userData.profilePhoto
                    ? "appBar__profile__profilePicture"
                    : "appBar__profile__defaultProfilePicture"}
                />
                {userData.username}
              </div>
              <Menu
                anchorEl={anchorElement}
                open={menuOpen}
                onClose={toggleMenu}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: "''",
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={() => handleClick("profile", `${userData.username}`)}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  View profile
                </MenuItem>
                <MenuItem onClick={() => handleClick("accounts")}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Edit profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => handleClick("messages")}>
                  <ListItemIcon>
                    <MessageIcon fontSize="small" />
                  </ListItemIcon>
                  Messages
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => handleClick("logout")}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <div className="appBar__profile" aria-hidden="true" onClick={() => toggleLoginModal(true)}>
              <img src={EmptyProfilePic} alt="" className="appBar__profile__defaultProfilePicture" />
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
