import { gql } from "@apollo/client";
import { USER_BASIC_INFO_FRAGMENT } from "./fragments";

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
  mutation Mutation($input: UserLoginInput) {
    login(input: $input) {
      ...UserBasicInfoFragment
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
