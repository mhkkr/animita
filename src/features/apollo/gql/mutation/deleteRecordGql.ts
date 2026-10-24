import { gql, type TypedDocumentNode } from '@apollo/client';

import type { DeleteRecordMutation, DeleteRecordMutationVariables } from '~/features/apollo/generated-types';

export const deleteRecordGql: TypedDocumentNode<DeleteRecordMutation, DeleteRecordMutationVariables> = gql`
  mutation deleteRecord($recordId: ID!) {
    deleteRecord(
      input: {
        recordId: $recordId
      }
    ) {
      episode {
        id
        viewerRecordsCount
        viewerDidTrack
        recordsCount
				records {
					nodes {
						id
					}
				}
      }
    }
  }
`;