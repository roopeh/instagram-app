import React from "react";
import Button from "@mui/material/Button";

import musk from "../../assets/placeholders/musk.jpg";

interface ProfileTopProps {
  username: string
}

const ProfilePageTop = ({ username }: ProfileTopProps) => (
  <div className="profilePage__topBar">
    <div className="profilePage__profilePicture">
      <div className="profilePage__profilePicture__picture">
        <img src={musk} alt="" />
      </div>
      <div>
        <Button
          variant="contained"
          style={{
            width: "100px", marginTop: "5px", fontSize: "9px", fontWeight: "600",
          }}
        >
          Edit Profile
        </Button>
      </div>
    </div>
    <div className="profilePage__topBar__textFlexBox">
      <div className="profilePage__topBar__textContainer">
        <span className="strongerFont">
          {username}
        </span>
        <div className="profilePage__topBar__textContainer__userInfo">
          <span className="smallerButBoldedFont" style={{ paddingRight: "10px" }}>
            Elon Musk
          </span>
          <br />
          <span className="smallerGrayedFont">
            Founder of Tesla!
          </span>
        </div>
      </div>
      <div className="profilePage__buttonsOuterBox">
        <div className="profilePage__buttonsFlexBox">
          <div className="profilePage__buttonsFlexBox__textBox">
            <div className="profilePage__buttonsFlexBox__number">1282</div>
            <div className="profilePage__buttonsFlexBox__label">photos</div>
          </div>
          <div className="profilePage__buttonsFlexBox__textBox">
            <div className="profilePage__buttonsFlexBox__number">468</div>
            <div className="profilePage__buttonsFlexBox__label">following</div>
          </div>
          <div className="profilePage__buttonsFlexBox__textBox" style={{ border: 0 }}>
            <div className="profilePage__buttonsFlexBox__number">388322</div>
            <div className="profilePage__buttonsFlexBox__label">followers</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProfilePageTop;
