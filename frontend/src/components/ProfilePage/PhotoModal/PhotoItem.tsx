/* eslint-disable react/require-default-props */
import React from "react";
import { Link } from "react-router-dom";
import EmptyProfilePic from "../../../assets/empty_profile.png";
import { formatDateForPhoto } from "../../../utils/dateFormatter";
import { User } from "../../../types";

interface PhotoItemProps {
  author: User,
  content: string,
  unixDate: number,
  style?: React.CSSProperties,
}

const PhotoItem = ({
  author, content, unixDate, style,
}: PhotoItemProps) => {
  const [formattedDate, detailedDate] = formatDateForPhoto(unixDate);
  return (
    <div className="photoModal__textFlex__item" style={style}>
      <Link to={`/${author.username}`}>
        <div
          className="photoModal__avatar"
          title={author.username}
          style={{
            backgroundImage: `url(${author.profilePhoto
              ? author.profilePhoto.imageString
              : EmptyProfilePic})`,
          }}
        />
      </Link>
      <div className="photoModal__userInfo">
        <div className="photoModal__userInfo__top">
          <Link
            to={`/${author.username}`}
            className="photoModal__userInfo__username"
          >
            {author.username}
          </Link>
          <div title={detailedDate} className="photoModal__userInfo__date">
            {formattedDate}
          </div>
        </div>
        <div className="photoModal__userInfo__content">
          {content}
        </div>
      </div>
    </div>
  );
};

export default PhotoItem;
