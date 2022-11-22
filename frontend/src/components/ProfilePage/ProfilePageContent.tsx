import React, { useState } from "react";
import {
  Routes, Route, useNavigate,
} from "react-router-dom";
import Button from "@mui/material/Button";
import musk from "../../assets/placeholders/musk.jpg";
import PostModal from "./PostModal";
import PhotoModal from "./PhotoModal";
import { getUserData } from "../../utils/userdata";

interface ProfileContentProps {
  username: string,
}

const ProfilePageContent = ({ username }: ProfileContentProps) => {
  const [postModalOpen, setPostModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const userData = getUserData();

  const showPostButton: boolean = userData !== null && userData.username === username;

  return (
    <div className="profilePage__mainContent">
      <div className="profilePage__imageFlex__postContainer">
        {showPostButton && (
          <Button
            type="button"
            variant="contained"
            size="small"
            onClick={() => setPostModalOpen(!postModalOpen)}
            style={{ fontSize: "10px", fontWeight: "600" }}
          >
            Create post
          </Button>
        )}
        <PostModal open={postModalOpen} onClose={() => setPostModalOpen(false)} />

        <Routes>
          <Route path="/:photoId" element={<PhotoModal />} />
        </Routes>
      </div>
      <div className="profilePage__imageFlex">
        {[...Array(9)].map((e, i) => (
          <div key={e} className="profilePage__imageFlex__rowDivider">
            <div className="profilePage__imageContainer">
              <div className="profilePage__imageContainer__dateText">
                {(i % 2) ? null : "October 2022"}
              </div>
              <div
                className="profilePage__imageContainer__imageBox"
                aria-hidden="true"
                onClick={() => navigate(`${i}`)}
              >
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
