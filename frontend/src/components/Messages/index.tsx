import React, { useState, useEffect } from "react";
import { ApolloQueryResult } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import AddCommentIcon from "@mui/icons-material/MapsUgc";
import AppBar from "../AppBar";
import ConversationItem from "./ConversationItem";
import MessageContainer from "./MessageContainer";
import NewConversationModal from "./NewConversationModal";
import ErrorModal from "../ErrorModal";
import { getUserData } from "../../utils/userdata";
import useGetConversations from "../../hooks/useGetConversations";
import { Conversation } from "../../types";
import { MESSAGE_RECEIVED } from "../../graphql/subscriptions";
import "../../styles/Messages.css";

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
  const [conversations, setConversations] = useState<Array<Conversation>>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(undefined);
  const [errorText, setErrorText] = useState<string>("");
  const navigate = useNavigate();

  const {
    conversations: unsortedConversations, error, loading, refetch, subscribeToMore,
  } = useGetConversations();

  // Sort conversations from newest to oldest
  useEffect(() => {
    setConversations(!unsortedConversations
      ? (
        []
      ) : (
        unsortedConversations.slice().sort((a, b) => {
          if (!a.messages.length || !b.messages.length) {
            return 0;
          }
          return b.messages.at(-1)!.date - a.messages.at(-1)!.date;
        })
      ));
  }, [unsortedConversations]);

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

  useEffect(() => {
    subscribeToMore({
      document: MESSAGE_RECEIVED,
      variables: {
        userId: userData.id,
      },
      updateQuery: (prev: any, { subscriptionData }: any) => {
        const prevMessages: Array<Conversation> | null = prev && prev.getMessages
          ? prev.getMessages
          : null;
        if (!subscriptionData.data || !subscriptionData.data.newMessage) {
          return prev;
        }

        const { conversation, message } = subscriptionData.data.newMessage;
        if (prevMessages && prevMessages.length) {
          // Check if user has this conversation already
          // if not, push it directly to array
          const existingConv = prevMessages.find((itr) => itr.id === conversation.id);
          if (existingConv) {
            // If conversation exists, check if conversation has this message already
            let modifiedConv = existingConv;
            const existingMsg = existingConv.messages.find((itr) => itr.id === message.id);
            if (!existingMsg) {
              modifiedConv = {
                ...existingConv,
                messages: existingConv.messages.concat(message),
              };
            }

            return {
              ...prev,
              getMessages: prevMessages.map((conv) => (
                conv.id === modifiedConv.id ? modifiedConv : conv
              )),
            };
          }
        }

        return {
          ...prev,
          getMessages: prevMessages
            ? prevMessages.concat(conversation)
            : [conversation],
        };
      },
    });
  }, []);

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
  const selectConversation = (chat: Conversation): void => setSelectedChatId(chat.id);
  const selectedConversation = selectedChatId
    ? conversations.find((itr) => itr.id === selectedChatId)
    : undefined;
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
                        className={conversation.id === selectedChatId
                          ? "messages__conversation__selected"
                          : ""}
                        onClick={() => setSelectedChatId(conversation.id)}
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
        {selectedConversation && (
          <MessageContainer
            conversation={selectedConversation}
            selectConversation={selectConversation}
            handleError={handleError}
          />
        )}
      </div>
    </DefaultMessages>
  );
};

export default Messages;
