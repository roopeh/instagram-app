import { gql } from "@apollo/client";
import { MESSAGES_FRAGMENT, PARTICIPIANTS_FRAGMENT } from "./fragments";

// eslint-disable-next-line import/prefer-default-export
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
