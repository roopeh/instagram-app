import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const PhotoModal = () => {
  const { photoId } = useParams();
  const navigate = useNavigate();

  return (
    <div
      aria-hidden="true"
      className="profilePage__imageModal"
      onClick={() => navigate(-1)}
    >
      <div
        aria-hidden="true"
        onClick={(e) => e.stopPropagation()}
        style={{ width: "200px", height: "200px", border: "5px solid white" }}
      >
        Test modal
        <br />
        {`picture id ${photoId}`}
      </div>
    </div>
  );
};

export default PhotoModal;
