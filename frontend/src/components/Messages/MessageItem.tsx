import React from "react";
import EmptyProfilePic from "../../assets/empty_profile.png";
import { Message, User } from "../../types";
import { formatDateForMessage } from "../../utils/dateFormatter";

interface ItemProps {
  message: Message,
  isSenderMe: boolean,
  isSameSenderThanPrevious: boolean,
}

interface HeaderProps {
  isSenderMe: boolean,
  sender: User,
}

const MessageHeader = ({ isSenderMe, sender }: HeaderProps) => (
  <div>
    {!isSenderMe
      ? (
        <div
          className="messages__messageContent__avatar"
          title={`${sender.firstName} ${sender.lastName}`}
          style={{
            backgroundImage: `url(${sender.profilePhoto
              ? sender.profilePhoto.imageString
              : EmptyProfilePic})`,
          }}
        />
      ) : (
        <div className="messages__messageContent__header">
          you
        </div>
      )}
  </div>
);

const MessageItem = ({
  message, isSenderMe, isSameSenderThanPrevious,
}: ItemProps) => (
  <div className="messages__messageContent">
    {!isSameSenderThanPrevious && (
      <MessageHeader isSenderMe={isSenderMe} sender={message.sender} />
    )}
    <div className="messages__messageContent__box">
      {message.message}
    </div>
    <div
      className="messages__messageContent__date"
      style={isSenderMe ? { textAlign: "right" } : {}}
    >
      {formatDateForMessage(message.date)}
    </div>
  </div>
);

export default MessageItem;
