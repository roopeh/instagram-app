import React from "react";
import {
  Routes, Route, useNavigate,
} from "react-router-dom";

interface ProfileContentProps {
  coverPhotoFunc: any
}

const ProfilePageContent = ({ coverPhotoFunc }: ProfileContentProps) => {
  const navigate = useNavigate();
  return (
    <div>
      Content here...
      <br />
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
  );
};

export default ProfilePageContent;
