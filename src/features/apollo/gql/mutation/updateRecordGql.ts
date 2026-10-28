import { gql, type TypedDocumentNode } from '@apollo/client';

import type { UpdateRecordMutation, UpdateRecordMutationVariables } from '~/features/apollo/generated-types';

export const updateRecordGql: TypedDocumentNode<UpdateRecordMutation, UpdateRecordMutationVariables> = gql`
  mutation updateRecord($recordId: ID!, $comment: String, $ratingState: RatingState) {
    updateRecord(
      input: {
        recordId: $recordId
        comment: $comment
        ratingState: $ratingState
      }
    ) {
      record {
				id
				annictId
				ratingState
				comment
				createdAt
				updatedAt
				likesCount
				user {
					name
					username
					avatarUrl
				}
        episode {
          id
          viewerRecordsCount
          viewerDidTrack
          recordsCount
        }
      }
    }
  }
`;