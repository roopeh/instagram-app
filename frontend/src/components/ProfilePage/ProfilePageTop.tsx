import React from "react";
import Button from "@mui/material/Button";

interface ProfileTopProps {
  username: string
}

const ProfilePageTop = ({ username }: ProfileTopProps) => (
  <div className="profileTopBar">
    <div className="profilePicture">
      <div className="picture">
        profile picture
      </div>
      <div>
        <Button variant="contained" className="mainButton">
          Edit Profile
        </Button>
      </div>
    </div>
    <div className="textFlexBox">
      <div className="fillerFlex" />
      <div className="textContainer">
        <span className="strongerFont">
          {username}
        </span>
        <br />
        <span className="smallerButBoldedFont">
          Elon Musk
        </span>
        <br />
        <span className="smallerGrayedFont">
          Founder of Tesla!
        </span>
      </div>
      <div className="buttonOuterBox">
        <div className="buttonFlexBox">
          <div className="textBox">
            <div className="numbers">1282</div>
            <div className="label">photos</div>
          </div>
          <div className="textBox">
            <div className="numbers">468</div>
            <div className="label">following</div>
          </div>
          <div className="textBox" style={{ border: 0 }}>
            <div className="numbers">388322</div>
            <div className="label">followers</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProfilePageTop;
