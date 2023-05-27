import { gql } from '@apollo/client';

export const userGql = gql`
  query user {
    viewer {
      username
      avatarUrl
    }
  }
`;