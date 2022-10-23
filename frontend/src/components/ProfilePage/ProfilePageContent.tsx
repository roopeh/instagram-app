import React from "react";
import {
  Routes, Route, useNavigate,
} from "react-router-dom";

const ProfilePageContent = () => {
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

      <Routes>
        <Route
          path="/:photoId"
          element={(
            <div
              aria-hidden="true"
              className="overlayModal"
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
