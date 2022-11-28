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

export const GET_PHOTO = gql`
  query Query($input: PictureQueryInput) {
    getPhoto(input: $input) {
      id
      imageString
      author {
        id
        username
        profilePhoto {
          id
          imageString
        }
      }
      publishDate
      captionText
    }
  }
`;

export const GET_PHOTO_LIKES = gql`
  query Query($input: PictureQueryInput) {
    getPhoto(input: $input) {
      id
      likes {
        id
        user {
          id
          username
          profilePhoto {
            id
            imageString
          }
        }
      }
      likesCount
    }
  }
`;

export const GET_PHOTO_COMMENTS = gql`
  query Query($input: PictureQueryInput) {
    getPhoto(input: $input) {
      id
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
  }
`;
