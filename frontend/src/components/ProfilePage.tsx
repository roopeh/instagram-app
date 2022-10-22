import React from "react";

const ProfilePage = () => (
  <div>
    <div className="profileBackground" />
    <div className="profileCoverPhoto" />

    <div className="profileContainer">
      <div className="profileTopBar">

        <div className="profilePicture">
          <div className="picture">
            profile picture
          </div>
          <div>
            edit profile
          </div>
        </div>

        <div className="textContainer">
          <div className="fillerFlex" />
          <div style={{ flex: 4 }}>
            Username
            <br />
            Firstname lastname
          </div>
          <div>
            Some buttons here
          </div>
        </div>
      </div>
      Content here...
    </div>
  </div>
);

export default ProfilePage;
