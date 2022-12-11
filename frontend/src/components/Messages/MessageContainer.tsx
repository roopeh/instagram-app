import React, { useState, useEffect, useRef } from "react";
import { Field, Form, Formik } from "formik";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import { Conversation } from "../../types";
import ConversationItem from "./ConversationItem";
import useSendMessage from "../../hooks/useSendMessage";
import MessageItem from "./MessageItem";
import { getUserData } from "../../utils/userdata";

interface BodyProps {
  conversation: Conversation,
  selectConversation: (chat: Conversation) => void,
  handleError: (str: string) => void,
}

const ConversationBody = ({ conversation, selectConversation, handleError }: BodyProps) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const messagesBottom = useRef<HTMLDivElement>(null);
  const [sendMessage] = useSendMessage();

  useEffect(() => {
    messagesBottom.current?.scrollIntoView();
  }, [conversation.messages]);

  const receiver = conversation.participiants.at(0);
  if (!receiver) {
    return null;
  }

  const postMessage = async (values: any, { resetForm }: any) => {
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
      handleError(String(err));
      setUploading(false);
    }
    resetForm();
  };

  const userData = getUserData()!;
  let isSenderMe: boolean = false;

  return (
    <div className="messages__messageContainer">
      <div className="messages__messageContainer__header">
        <ConversationItem conversation={conversation} />
      </div>
      <div className="messages__messageContainer__content">
        <table>
          <tbody>
            {conversation.messages.map((msg) => {
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
                            isSameSenderThanPrevious={isSenderMe === wasSenderMe}
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td>
                          <MessageItem
                            message={msg}
                            isSenderMe={isMyMsg}
                            isSameSenderThanPrevious={isSenderMe === wasSenderMe}
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
      <div className="messages__messageContainer__bottom">
        <Formik
          initialValues={{ message: "" }}
          onSubmit={postMessage}
        >
          {() => (
            <Form className="form ui messages__bottomFlex">
              <Field
                type="input"
                name="message"
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
