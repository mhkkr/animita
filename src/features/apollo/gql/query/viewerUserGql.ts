import { gql } from '@apollo/client';

export const viewerUserGql = gql`
  query viewerUser {
    viewer {
      username
      annictId
    }
  }
`;