import { gql } from "@apollo/client";
import { MESSAGES_FRAGMENT, PARTICIPIANTS_FRAGMENT } from "./fragments";

export const MESSAGE_RECEIVED = gql`
  ${PARTICIPIANTS_FRAGMENT}
  ${MESSAGES_FRAGMENT}
  subscription Subscription($userId: String!) {
    newMessage(userId: $userId) {
      conversation {
        id
        ...ParticipiantsFragment
        ...MessagesFragment
      }
      message {
        id
        sender {
          id
          username
          firstName
          lastName
          profilePhoto {
            id
            imageString
          }
        }
        date
        message
      }
    }
  }
`;

export const USER_TYPING_RECEIVED = gql`
  subscription UserTyping($conversationId: String!) {
    userTyping(conversationId: $conversationId) {
      conversationId
      user {
        id
        username
        firstName
        lastName
      }
    }
  }
`;
