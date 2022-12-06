import { gql } from "@apollo/client";
import {
  COMMENTS_FRAGMENT, FOLLOWER_FRAGMENT, FOLLOWING_FRAGMENT, LIKES_FRAGMENT,
  PHOTOS_FRAGMENT, USER_BASIC_INFO_FRAGMENT,
} from "./fragments";

export const ME = gql`
  ${USER_BASIC_INFO_FRAGMENT}
  query Query {
    me {
      ...UserBasicInfoFragment
      following {
        id
      }
    }
  }
`;

export const ALL_USERS = gql`
  query Query($input: UserQueryInput) {
    allUsers(input: $input) {
      id
      username
      firstName
      lastName
      profilePhoto {
        id
        imageString
      }
    }
  }
`;

export const GET_USER = gql`
  ${USER_BASIC_INFO_FRAGMENT}
  ${PHOTOS_FRAGMENT}
  ${FOLLOWING_FRAGMENT}
  ${FOLLOWER_FRAGMENT}
  query GetUser($input: UserInput) {
    getUser(input: $input) {
      ...UserBasicInfoFragment
      ...PhotosFragment
      ...FollowingFragment
      ...FollowerFragment
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
  ${LIKES_FRAGMENT}
  query Query($input: PictureQueryInput) {
    getPhoto(input: $input) {
      id
      ...LikesFragment
    }
  }
`;

export const GET_PHOTO_COMMENTS = gql`
  ${COMMENTS_FRAGMENT}
  query Query($input: PictureQueryInput) {
    getPhoto(input: $input) {
      id
      ...CommentsFragment
    }
  }
`;

export const GET_FEED_PHOTOS = gql`
  ${LIKES_FRAGMENT}
  query Query {
    getFeedPhotos {
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
      ...LikesFragment
      commentsCount
    }
  }
`;
