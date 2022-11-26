import React, { useState } from "react";
import {
  Routes, Route, useNavigate,
} from "react-router-dom";
import Button from "@mui/material/Button";
import musk from "../../assets/placeholders/musk.jpg";
import PostModal from "./PostModal";
import PhotoModal from "./PhotoModal";
import { getUserData } from "../../utils/userdata";
import { Photo } from "../../types";
import { formatDateForProfile } from "../../utils/dateFormatter";

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
        <PostModal open={postModalOpen} onClose={() => setPostModalOpen(false)} />

        <Routes>
          <Route path="/:photoId" element={<PhotoModal username={username} />} />
        </Routes>
      </div>
      <div className="profilePage__imageFlex">
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
        {5 - photos.length > 0 && [...Array(5 - photos.length)].map((e, i) => (
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
