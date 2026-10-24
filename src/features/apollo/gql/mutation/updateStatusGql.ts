import { gql, type TypedDocumentNode } from '@apollo/client';

import type { UpdateStatusMutation, UpdateStatusMutationVariables } from '~/features/apollo/generated-types';

export const updateStatusGql: TypedDocumentNode<UpdateStatusMutation, UpdateStatusMutationVariables> = gql`
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