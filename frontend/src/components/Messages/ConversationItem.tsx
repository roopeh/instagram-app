import React from "react";
import EmptyProfilePic from "../../assets/empty_profile.png";
import { Conversation } from "../../types";
import { getUserData } from "../../utils/userdata";

interface ItemProps {
  conversation: Conversation,
}

const ConversationItem = ({ conversation }: ItemProps) => {
  const userData = getUserData()!;
  const receiver = conversation.participiants.find((itr) => itr.id !== userData.id);
  if (!receiver) {
    return null;
  }

  return (
    <div className="messages__conversation__item">
      <div
        className="messages__conversation__avatar"
        style={{
          backgroundImage: `url(${receiver.profilePhoto
            ? receiver.profilePhoto.imageString
            : EmptyProfilePic})`,
        }}
      />
      <div className="messages__conversation__name">
        {`${receiver.firstName} ${receiver.lastName}`}
      </div>
    </div>
  );
};

export default ConversationItem;
