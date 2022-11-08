import { gql } from "@apollo/client";

export const REGISTER = gql`
  mutation Mutation($input: UserRegisterInput) {
    createUser(input: $input) {
      id
      username
    }
  }
`;

export const LOGIN = gql`
  mutation Mutation($input: UserLoginInput) {
    login(input: $input) {
      id
      username
      firstName
      profilePhoto {
        id
        imageString
      }
    }
  }
`;
