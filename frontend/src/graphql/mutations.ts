import { gql } from "@apollo/client";
import {
  COMMENTS_FRAGMENT, FOLLOWER_FRAGMENT, FOLLOWING_FRAGMENT, LIKES_FRAGMENT,
  MESSAGES_FRAGMENT,
  PARTICIPIANTS_FRAGMENT,
  PHOTOS_FRAGMENT,
  USER_BASIC_INFO_FRAGMENT,
} from "./fragments";

export const REGISTER = gql`
  mutation Mutation($input: UserRegisterInput) {
    createUser(input: $input) {
      id
      username
    }
  }
`;

export const LOGIN = gql`
  ${USER_BASIC_INFO_FRAGMENT}
  ${FOLLOWING_FRAGMENT}
  mutation Mutation($input: UserLoginInput) {
    login(input: $input) {
      ...UserBasicInfoFragment
      ...FollowingFragment
    }
  }
`;

export const LOGOUT = gql`
  mutation Mutation {
    logout
  }
`;

export const SET_PROFILE_PICTURE = gql`
  mutation Mutation($input: PictureInput) {
    setProfilePicture(input: $input) {
      id
      imageString
    }
  }
`;

export const SET_NAMES = gql`
  mutation Mutation($input: NameInput) {
    setNames(input: $input) {
      id
      firstName
      lastName
    }
  }
`;

export const SET_BIOTEXT = gql`
  mutation Mutation($input: BioTextInput) {
    setBioText(input: $input) {
      id
      bioText
    }
  }
`;

export const SET_COVER_PICTURE = gql`
mutation Mutation($input: PictureInput) {
  setCoverPicture(input: $input) {
      id
      imageString
    }
  }
`;

export const CREATE_POST = gql`
  ${PHOTOS_FRAGMENT}
  mutation Mutation($input: PictureInput) {
    createPost(input: $input) {
      id
      ...PhotosFragment
    }
  }
`;

export const DELETE_POST = gql`
  ${PHOTOS_FRAGMENT}
  mutation Mutation($input: PictureIdInput) {
    deletePost(input: $input) {
      id
      ...PhotosFragment
      profilePhoto {
        id
        imageString
      }
      coverPhoto {
        id
        imageString
      }
    }
  }
`;

export const TOGGLE_LIKE = gql`
  ${LIKES_FRAGMENT}
  mutation Mutation($input: PictureIdInput) {
    toggleLike(input: $input) {
      id
      ...LikesFragment
    }
  }
`;

export const ADD_COMMENT = gql`
  ${COMMENTS_FRAGMENT}
  mutation Mutation($input: CommentInput) {
    addComment(input: $input) {
      id
      ...CommentsFragment
    }
  }
`;

export const FOLLOW_USER = gql`
  ${FOLLOWER_FRAGMENT}
  ${FOLLOWING_FRAGMENT}
  mutation Mutation($input: FollowInput) {
    followUser(input: $input) {
      id
      ...FollowerFragment
      ...FollowingFragment
    }
  }
`;

export const CREATE_CONVERSATION = gql`
  ${PARTICIPIANTS_FRAGMENT}
  ${MESSAGES_FRAGMENT}
  mutation Mutation($input: ConversationInput) {
    createConversation(input: $input) {
      id
      ...ParticipiantsFragment
      ...MessagesFragment
    }
  }
`;

export const SEND_MESSAGE = gql`
  ${PARTICIPIANTS_FRAGMENT}
  ${MESSAGES_FRAGMENT}
  mutation Mutation($input: MessageInput) {
    sendMessage(input: $input) {
      id
      ...ParticipiantsFragment
      ...MessagesFragment
    }
  }
`;
