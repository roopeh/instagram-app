import React, { useState } from "react";
import { useApolloClient } from "@apollo/client";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
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
import SearchComponent from "./SearchComponent";

const AppBar = () => {
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [menuAnchorElement, setMenuAnchorElement] = useState<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [searchAnchorElement, setSearchAnchorElement] = useState<HTMLElement | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [logout] = useLogout();
  const navigate = useNavigate();
  const location = useLocation();
  const client = useApolloClient();

  // Get user data from local storage
  const userData = getUserData();

  const toggleLoginModal = (toggle: boolean): void => {
    setLoginModalOpen(toggle);
  };

  const toggleMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    if (menuOpen) {
      setMenuAnchorElement(null);
      setMenuOpen(false);
    } else {
      setMenuAnchorElement(event.currentTarget);
      setMenuOpen(true);
    }
  };

  const navigateOrReload = (page: string): void => {
    const currentLocation = location.pathname;
    if (currentLocation === page) {
      navigate(0);
    } else {
      navigate(page);
    }
  };

  const handleLogout = async (): Promise<void> => {
    await logout();
    client.clearStore();
    // client.cache.gc();
    navigateOrReload("/");
  };

  const handleMenuClick = (page: string, value?: string): void => {
    setMenuOpen(false);
    switch (page) {
      case "logout":
        handleLogout();
        break;
      case "profile":
        navigateOrReload(`/${value}`);
        break;
      case "messages":
        navigateOrReload(`/accounts/${page}`);
        break;
      default:
        navigateOrReload(`/${page}`);
        break;
    }
  };

  const toggleSearchPopover = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    setSearchAnchorElement(searchAnchorElement
      ? null : event.currentTarget);
    setSearchText("");
  };

  const searchPopupOpen = Boolean(searchAnchorElement);
  return (
    <div className="appBar">
      <div className="appBar__content">
        <Link to="/">
          <img src={Logo} alt="Instagram" className="appBar__logo" />
        </Link>
        <div className="appBar__rightContainer">
          <div className="appBar__searchButton">
            <div
              className="appBar__searchButton__rounded"
              onClick={toggleSearchPopover}
              aria-hidden
            >
              <SearchIcon
                fontSize="medium"
                style={{ color: "white" }}
              />
            </div>
          </div>
          <Popover
            open={searchPopupOpen}
            anchorEl={searchAnchorElement}
            onClose={toggleSearchPopover}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
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
                  left: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
          >
            <div className="appBar__searchContainer">
              <TextField
                name="searchText"
                placeholder="Search usernames or persons..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                size="small"
                inputProps={{ style: { fontSize: "11px" } }}
                style={{ width: "100%" }}
              />
            </div>
            <SearchComponent
              searchText={searchText}
              clearText={() => setSearchText("")}
            />
          </Popover>
          <div
            className="appBar__profile"
            aria-hidden
            onClick={userData ? toggleMenu : () => toggleLoginModal(true)}
          >
            {userData
              ? (
                <>
                  <img
                    src={userData.profilePhoto
                      ? userData.profilePhoto.imageString
                      : EmptyProfilePic}
                    alt=""
                    className={userData.profilePhoto
                      ? "appBar__profile__profilePicture"
                      : "appBar__profile__defaultProfilePicture"}
                  />
                  {userData.username}
                  <Menu
                    anchorEl={menuAnchorElement}
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
                    <MenuItem onClick={() => handleMenuClick("profile", `${userData.username}`)}>
                      <ListItemIcon>
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                      View profile
                    </MenuItem>
                    <MenuItem onClick={() => handleMenuClick("accounts")}>
                      <ListItemIcon>
                        <Settings fontSize="small" />
                      </ListItemIcon>
                      Edit profile
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => handleMenuClick("messages")}>
                      <ListItemIcon>
                        <MessageIcon fontSize="small" />
                      </ListItemIcon>
                      Messages
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => handleMenuClick("logout")}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <img src={EmptyProfilePic} alt="" className="appBar__profile__defaultProfilePicture" />
                  Login
                </>
              )}
          </div>
        </div>
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
