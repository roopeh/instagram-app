/* eslint-disable react/require-default-props */
import React from "react";
import { Link } from "react-router-dom";
import EmptyProfilePic from "../../assets/empty_profile.png";
import { User } from "../../types";

interface PhotoItemProps {
  author: User,
  content: string,
  unixDate: number,
  style?: React.CSSProperties,
}

const PhotoItem = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  author, content, unixDate, style,
}: PhotoItemProps) => (
  <div className="photoModal__textFlex__item" style={style}>
    <div
      className="photoModal__avatar"
      style={{
        backgroundImage: `url(${author.profilePhoto
          ? author.profilePhoto.imageString
          : EmptyProfilePic})`,
      }}
    />
    <div className="photoModal__userInfo">
      <div className="photoModal__userInfo__top">
        <Link
          to={`/${author.username}`}
          className="photoModal__userInfo__username"
        >
          {author.username}
        </Link>
        <div className="photoModal__userInfo__date">
          2h
        </div>
      </div>
      <div className="photoModal__userInfo__content">
        {content}
      </div>
    </div>
  </div>
);

export default PhotoItem;
