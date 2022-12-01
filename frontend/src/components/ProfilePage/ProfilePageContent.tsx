import React, { useState } from "react";
import {
  Routes, Route, useNavigate,
} from "react-router-dom";
import Button from "@mui/material/Button";
import PhotoCamera from "@mui/icons-material/PhotoCameraOutlined";
import PostModal from "./PostModal";
import PhotoModal from "./PhotoModal";
import { getUserData } from "../../utils/userdata";
import { formatDateForProfile } from "../../utils/dateFormatter";
import { Photo } from "../../types";

interface ProfileContentProps {
  username: string,
  photos: Array<Photo>,
}

const ProfilePageContent = ({ username, photos }: ProfileContentProps) => {
  const [postModalOpen, setPostModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const userData = getUserData();

  const showPostButton: boolean = userData !== null && userData.username === username;

  // Format date for photos
  let previousDate = "";
  const formattedPhotos = photos.map((photo) => {
    const date = formatDateForProfile(photo.publishDate);
    if (previousDate !== date) {
      previousDate = date;
      return { ...photo, publishDate: date };
    }
    return { ...photo, publishDate: null };
  });

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
        <PostModal
          open={postModalOpen}
          onClose={() => setPostModalOpen(false)}
        />

        <Routes>
          <Route path="/:photoId" element={<PhotoModal username={username} />} />
        </Routes>
      </div>
      <div className="profilePage__imageFlex">
        {!formattedPhotos.length && (
          <div className="profilePage__empty">
            <div className="profilePage__empty__roundedBorder">
              <PhotoCamera style={{
                width: "40px", height: "40px", color: "rgba(0, 0, 0, 0.7)",
              }}
              />
            </div>
            <div style={{ marginTop: "20px" }}>
              No photos yet
            </div>
          </div>
        )}
        {formattedPhotos.map((photo) => (
          <div key={photo.id} className="profilePage__imageFlex__rowDivider">
            <div className="profilePage__imageContainer">
              <div className="profilePage__imageContainer__dateText">
                {photo.publishDate}
              </div>
              <div
                className="profilePage__imageContainer__imageBox"
                aria-hidden="true"
                onClick={() => navigate(`${photo.id}`)}
              >
                <img src={photo.imageString} alt="" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePageContent;
