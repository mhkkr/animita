import { gql } from '@apollo/client';

export const updateStatusGql = gql`
  mutation updateStatus($state: StatusState!, $workId: ID!) {
    updateStatus(
      input: {
        state: $state
        workId: $workId
      }
    ) {
      work {
        id
      }
    }
  }
`;