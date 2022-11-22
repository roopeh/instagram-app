import { gql } from "@apollo/client";
import { USER_BASIC_INFO_FRAGMENT } from "./fragments";

export const ME = gql`
  ${USER_BASIC_INFO_FRAGMENT}
  query Query {
    me {
      ...UserBasicInfoFragment
    }
  }
`;

export const GET_USER = gql`
  ${USER_BASIC_INFO_FRAGMENT}
  query GetUser($input: UserInput) {
    getUser(input: $input) {
      ...UserBasicInfoFragment
      photos {
        id
        imageString
        publishDate
        captionText
        likes {
          id
          username
        }
        likesCount
        comments {
          id
          author {
            id
            username
            profilePhoto {
              id
              imageString
            }
          }
          date
          message
        }
        commentsCount
      }
      photoCount
      following {
        id
        username
      }
      followingCount
      followers {
        id
        username
      }
      followersCount
    }
  }
`;
