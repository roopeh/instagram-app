import React from "react";
import {
  Routes, Route, useNavigate,
} from "react-router-dom";

import musk from "../../assets/placeholders/musk.jpg";

interface ProfileContentProps {
  coverPhotoFunc: () => void
}

const ProfilePageContent = ({ coverPhotoFunc }: ProfileContentProps) => {
  const navigate = useNavigate();
  return (
    <div className="profilePage__mainContent">
      <div style={{ flex: "0 0 80px" }}>
        <button
          type="button"
          onClick={() => navigate("123")}
        >
          test overlay
        </button>
        <br />
        <button
          type="button"
          onClick={coverPhotoFunc}
        >
          test cover photo
        </button>

        <Routes>
          <Route
            path="/:photoId"
            element={(
              <div
                aria-hidden="true"
                className="profilePage__imageModal"
                onClick={() => navigate(-1)}
                onKeyDown={() => navigate(-1)}
              >
                <div>
                  Test modal
                </div>
              </div>
          )}
          />
        </Routes>
      </div>
      <div className="profilePage__imageFlex">
        {[...Array(9)].map((e, i) => (
          <div key={e} className="profilePage__imageFlex__rowDivider">
            <div className="profilePage__imageContainer">
              <div className="profilePage__imageContainer__dateText">
                {(i % 2) ? null : "October 2022"}
              </div>
              <div className="profilePage__imageContainer__imageBox">
                <img src={musk} alt="Musk" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePageContent;
