/* eslint-disable react/require-default-props */
import React from "react";
import Button from "@mui/material/Button";

interface ButtonProps {
  userId: string,
  loggedUserId: string,
  isFollowing: boolean,
  showProfileButton: boolean,
  editProfile?: () => void,
  follow: (userId: string) => Promise<void>,
  buttonSize?: "small" | "medium" | "large",
  buttonStyle?: React.CSSProperties,
}

const FollowButton = ({
  userId, loggedUserId, isFollowing, showProfileButton, editProfile,
  follow, buttonSize, buttonStyle,
}: ButtonProps) => {
  if (userId === loggedUserId) {
    if (!showProfileButton) {
      return null;
    }

    return (
      <Button
        variant="contained"
        size={buttonSize}
        style={buttonStyle}
        onClick={editProfile}
      >
        Edit Profile
      </Button>
    );
  }

  return (
    <Button
      variant="contained"
      size={buttonSize}
      color={isFollowing ? "error" : "primary"}
      style={buttonStyle}
      onClick={() => follow(userId)}
    >
      {isFollowing ? "Unfollow" : "Follow" }
    </Button>
  );
};

export default FollowButton;
