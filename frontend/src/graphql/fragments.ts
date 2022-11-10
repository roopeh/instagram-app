import { gql } from "@apollo/client";

// eslint-disable-next-line import/prefer-default-export
export const USER_BASIC_INFO_FRAGMENT = gql`
  fragment UserBasicInfoFragment on User {
    id
    username
    firstName
    profilePhoto {
      id
      imageString
    }
  }
`;
