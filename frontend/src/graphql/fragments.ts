import { gql } from "@apollo/client";

export const USER_BASIC_INFO_FRAGMENT = gql`
  fragment UserBasicInfoFragment on User {
    id
    username
    firstName
    lastName
    bioText
    profilePhoto {
      id
      imageString
    }
    coverPhoto {
      id
      imageString
    }
  }
`;

export const FOLLOWER_FRAGMENT = gql`
  fragment FollowerFragment on User {
    followers {
      id
      username
      firstName
      lastName
      profilePhoto {
        id
        imageString
      }
    }
    followersCount
  }
`;

export const FOLLOWING_FRAGMENT = gql`
  fragment FollowingFragment on User {
    following {
      id
      username
      firstName
      lastName
      profilePhoto {
        id
        imageString
      }
    }
    followingCount
  }
`;

export const PHOTOS_FRAGMENT = gql`
  fragment PhotosFragment on User {
    photos {
      id
      imageString
      publishDate
    }
    photoCount
  }
`;
export const LIKES_FRAGMENT = gql`
  fragment LikesFragment on Photo {
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
`;

export const COMMENTS_FRAGMENT = gql`
  fragment CommentsFragment on Photo {
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
`;
