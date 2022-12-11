import React, { useState } from "react";
import { ApolloQueryResult } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import AddCommentIcon from "@mui/icons-material/MapsUgc";
import AppBar from "../AppBar";
// import ConversationItem from "./ConversationItem";
import MessageContainer from "./MessageContainer";
import ErrorModal from "../ErrorModal";
import { getUserData } from "../../utils/userdata";
import "../../styles/Messages.css";
import NewConversationModal from "./NewConversationModal";
import useGetConversations from "../../hooks/useGetConversations";
import ConversationItem from "./ConversationItem";
import { Conversation } from "../../types";

interface DefaultMessagesProps {
  errorText: string,
  errorModalFunc: () => void,
  children: any,
}

const DefaultMessages = ({
  errorText, errorModalFunc, children,
}: DefaultMessagesProps) => (
  <div>
    <AppBar />
    <ErrorModal
      text={errorText}
      openBoolean={errorText.length > 0}
      buttonText="Return"
      onClose={errorModalFunc}
    />
    <div className="messages__background">
      <div className="messages__container">
        {children}
      </div>
    </div>
  </div>
);

const Messages = () => {
  const [newMessageOpen, setNewMessageOpen] = useState<boolean>(false);
  const [selectedChat, setSelectedChat] = useState<Conversation | undefined>(undefined);
  const [errorText, setErrorText] = useState<string>("");
  const navigate = useNavigate();

  const {
    conversations, error, loading, refetch,
  } = useGetConversations();

  const returnToMain = (): void => {
    setErrorText("");
    navigate("/");
  };

  const userData = getUserData();
  if (!userData) {
    return (
      <DefaultMessages
        errorText="You must be logged in to access this page"
        errorModalFunc={returnToMain}
      >
        {null}
      </DefaultMessages>
    );
  }
  if (error) {
    return (
      <DefaultMessages
        errorText={error.message}
        errorModalFunc={returnToMain}
      >
        {null}
      </DefaultMessages>
    );
  }

  const openNewMessageModal = (): void => {
    if (loading) {
      return;
    }

    setNewMessageOpen(true);
  };

  const handleError = (str: string): void => setErrorText(str);
  const selectConversation = (chat: Conversation): void => setSelectedChat(chat);
  const refetchConversations = (): Promise<ApolloQueryResult<any>> => refetch();

  return (
    <DefaultMessages errorText={errorText} errorModalFunc={() => setErrorText("")}>
      <Dialog
        open={newMessageOpen}
        onClose={() => setNewMessageOpen(false)}
      >
        <NewConversationModal
          refetchFunc={refetchConversations}
          closeFunc={() => setNewMessageOpen(false)}
        />
      </Dialog>
      <div className="messages__content">
        <div className="messages__conversations">
          <div className="messages__conversations__flex">
            <div className="messages__conversations__header">
              Messages
              <AddCommentIcon
                fontSize="large"
                titleAccess="Create new conversation"
                onClick={() => openNewMessageModal()}
                style={{ color: "rgb(120, 120, 120)", cursor: "pointer" }}
              />
            </div>
            <div className="messages__conversations__content">
              {conversations && (
                <table>
                  <tbody>
                    {conversations.map((conversation) => (
                      <tr
                        key={conversation.id}
                        className={conversation.id === selectedChat?.id
                          ? "messages__conversation__selected"
                          : ""}
                        onClick={() => setSelectedChat(conversation)}
                      >
                        <td><ConversationItem conversation={conversation} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        {selectedChat && (
          <MessageContainer
            conversation={selectedChat}
            selectConversation={selectConversation}
            handleError={handleError}
          />
        )}
      </div>
    </DefaultMessages>
  );
};

export default Messages;
