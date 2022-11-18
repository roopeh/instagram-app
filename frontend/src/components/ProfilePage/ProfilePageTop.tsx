import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import EmptyProfilePic from "../../assets/empty_profile.png";
import { getUserData } from "../../utils/userdata";

interface ProfileTopProps {
  username: string,
  firstName: string,
  lastName: string,
  bioText: string,
  profilePhoto: string,
  photoCount: number,
  followingCount: number,
  followersCount: number,
}

const ProfilePageTop = ({
  username, firstName, lastName, bioText, profilePhoto, photoCount, followingCount, followersCount,
}: ProfileTopProps) => {
  const navigate = useNavigate();

  const renderProfileButton: boolean = getUserData() !== null && username.length > 0;

  return (
    <div className="profilePage__topBar">
      <div
        className="profilePage__profilePicture"
        style={renderProfileButton ? { paddingBottom: "11px" } : {}}
      >
        <div className="profilePage__profilePicture__picture">
          <img
            src={profilePhoto.length > 0 ? profilePhoto : EmptyProfilePic}
            alt=""
            style={
              !profilePhoto.length ? { backgroundColor: "var(--borderColorLight" } : {}
            }
          />
        </div>
        <div>
          {renderProfileButton && (
            <Button
              variant="contained"
              style={{
                width: "100px", marginTop: "5px", fontSize: "9px", fontWeight: "600",
              }}
              onClick={() => navigate("/accounts")}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>
      <div className="profilePage__topBar__textFlexBox">
        <div className="profilePage__topBar__textContainer">
          <span className="strongerFont">
            {username}
          </span>
          <div className="profilePage__topBar__textContainer__userInfo">
            <span className="smallerButBoldedFont" style={{ paddingRight: "10px" }}>
              {`${firstName} ${lastName}`}
            </span>
            <br />
            <span className="smallerGrayedFont">
              {bioText}
            </span>
          </div>
        </div>
        <div className="profilePage__buttonsOuterBox">
          <div className="profilePage__buttonsFlexBox">
            <div className="profilePage__buttonsFlexBox__textBox">
              <div className="profilePage__buttonsFlexBox__number">{photoCount}</div>
              <div className="profilePage__buttonsFlexBox__label">photos</div>
            </div>
            <div className="profilePage__buttonsFlexBox__textBox">
              <div className="profilePage__buttonsFlexBox__number">{followingCount}</div>
              <div className="profilePage__buttonsFlexBox__label">following</div>
            </div>
            <div className="profilePage__buttonsFlexBox__textBox" style={{ border: 0 }}>
              <div className="profilePage__buttonsFlexBox__number">{followersCount}</div>
              <div className="profilePage__buttonsFlexBox__label">followers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageTop;
