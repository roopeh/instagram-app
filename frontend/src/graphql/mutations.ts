import { gql } from "@apollo/client";

// eslint-disable-next-line import/prefer-default-export
export const REGISTER = gql`
  mutation Mutation($input: UserRegisterInput) {
    createUser(input: $input) {
      id
      username
    }
  }
`;
