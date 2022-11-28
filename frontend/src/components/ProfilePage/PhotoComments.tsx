import React, { useEffect, useRef } from "react";
import PhotoItem from "./PhotoItem";
import { Comment } from "../../types";

interface CommentsProps {
  comments: Array<Comment>,
}

const PhotoComments = ({ comments }: CommentsProps) => {
  const commentsBottom = useRef<HTMLDivElement>(null);

  // Scroll to bottom when comments are loaded
  useEffect(() => {
    commentsBottom.current?.scrollIntoView();
  }, [comments]);

  return (
    <>
      <table>
        <tbody>
          {comments.map((comment) => (
            <tr key={comment.id}>
              <td>
                <PhotoItem
                  author={comment.author}
                  content={comment.message}
                  unixDate={comment.date}
                  style={{ borderBottom: 0 }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div ref={commentsBottom} />
    </>
  );
};

export default PhotoComments;
