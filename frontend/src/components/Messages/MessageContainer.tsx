import React, { useState, useEffect, useRef } from "react";
import { ApolloError, useSubscription } from "@apollo/client";
import {
  Field, Form, Formik, FormikProps,
} from "formik";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import { Conversation, User } from "../../types";
import ConversationItem from "./ConversationItem";
import useSendMessage from "../../hooks/useSendMessage";
import MessageItem from "./MessageItem";
import { getUserData } from "../../utils/userdata";
import useUserTyping from "../../hooks/useUserTyping";
import { USER_TYPING_RECEIVED } from "../../graphql/subscriptions";

interface BodyProps {
  conversation: Conversation,
  selectConversation: (chat: Conversation) => void,
  handleError: (str: string) => void,
}

type TypingSubscriptionUser = Pick<User, "id" | "username" | "firstName" | "lastName">;

let lastTypingMutation: number = 0;

const ConversationBody = ({ conversation, selectConversation, handleError }: BodyProps) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const messagesBottom = useRef<HTMLDivElement>(null);
  const [sendMessage] = useSendMessage();
  const [setUserTyping] = useUserTyping();
  const formikRef = useRef<FormikProps<{ message: string }>>(null);

  const [typingUser, setTypingUser] = useState<TypingSubscriptionUser | null>(null);
  // Needed because callback functions won't cause a component to re render
  const handleUserTyping = (user: TypingSubscriptionUser | null): void => setTypingUser(user);

  const userData = getUserData()!;

  useEffect(() => {
    if (!typingUser) {
      return () => null;
    }
    const timeOut = setTimeout(() => handleUserTyping(null), 3500);
    return () => clearTimeout(timeOut);
  }, [typingUser]);

  // Clear message input when conversation changes
  useEffect(() => {
    formikRef.current?.resetForm();
    setTypingUser(null);
  }, [conversation.id]);

  useEffect(() => {
    messagesBottom.current?.scrollIntoView();

    // Reset typing user if the latest message is from them
    const latestMessage = conversation.messages.at(-1);
    if (latestMessage && typingUser) {
      if (latestMessage.sender.id === typingUser.id
        && (latestMessage.date / 1000) >= lastTypingMutation) {
        setTypingUser(null);
      }
    }
  }, [conversation.messages]);

  useSubscription(USER_TYPING_RECEIVED, {
    variables: { conversationId: conversation.id },
    onData: ({ data }) => {
      if (data.data && data.data.userTyping) {
        const { user }: { user: TypingSubscriptionUser } = data.data.userTyping;
        // Do not show typing for yourself
        if (user.id === userData.id) {
          return;
        }
        handleUserTyping(user);
      }
    },
  });

  const receiver = conversation.participiants.at(0);
  if (!receiver) {
    return null;
  }

  const sendTyping = async (): Promise<void> => {
    const now = Date.now() / 1000;
    // Send mutation only once every 2 seconds
    if ((now - lastTypingMutation) < 2) {
      return;
    }

    lastTypingMutation = now;
    await setUserTyping({ conversationId: conversation.id });
  };

  const postMessage = async (values: any, { resetForm }: any): Promise<void> => {
    const { message } = values;
    if (!message || !message.length) {
      return;
    }

    setUploading(true);

    try {
      const { data } = await sendMessage({ conversation: conversation.id, message });
      if (data && data.sendMessage) {
        selectConversation(data.sendMessage);
      }
      setUploading(false);
    } catch (err) {
      handleError(err instanceof ApolloError ? err.message : String(err));
      setUploading(false);
    }
    resetForm();
  };

  let isSenderMe: boolean = false;

  return (
    <div className="messages__messageContainer">
      <div className="messages__messageContainer__header">
        <ConversationItem conversation={conversation} />
      </div>
      <div className="messages__messageContainer__content">
        <table>
          <tbody>
            {conversation.messages.map((msg, i) => {
              const isMyMsg: boolean = msg.sender.id === userData.id;
              const wasSenderMe = isSenderMe;
              isSenderMe = isMyMsg;
              return (
                <tr
                  key={msg.id}
                >
                  {isMyMsg
                    ? (
                      <>
                        <td colSpan={1} />
                        <td colSpan={1}>
                          <MessageItem
                            message={msg}
                            isSenderMe={isMyMsg}
                            isSameSenderThanPrevious={isSenderMe === wasSenderMe && i > 0}
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td>
                          <MessageItem
                            message={msg}
                            isSenderMe={isMyMsg}
                            isSameSenderThanPrevious={isSenderMe === wasSenderMe && i > 0}
                          />
                        </td>
                        <td />
                      </>
                    )}
                  <td />
                </tr>
              );
            })}
          </tbody>
        </table>
        <div ref={messagesBottom} />
      </div>
      <div className="messages__messageContent__typing">
        {typingUser ? `${typingUser.firstName} is typing...` : ""}
      </div>
      <div className="messages__messageContainer__bottom">
        <Formik
          innerRef={formikRef}
          initialValues={{ message: "" }}
          onSubmit={postMessage}
        >
          {({ handleChange }) => (
            <Form className="form ui messages__bottomFlex">
              <Field
                type="input"
                name="message"
                onChange={(event: any) => {
                  handleChange(event);
                  sendTyping();
                }}
                className="messages__bottomFlex__input"
              />
              <div className="messages__bottomFlex__button">
                {!uploading
                  ? (
                    <IconButton type="submit" size="small">
                      <SendIcon
                        color="primary"
                        fontSize="small"
                      />
                    </IconButton>
                  ) : (
                    <CircularProgress
                      size="20px"
                    />
                  )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ConversationBody;
