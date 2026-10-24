import { gql, type TypedDocumentNode } from '@apollo/client';

import type { CreateRecordMutation, CreateRecordMutationVariables } from '~/features/apollo/generated-types';

export const createRecordGql: TypedDocumentNode<CreateRecordMutation, CreateRecordMutationVariables> = gql`
  mutation createRecord($episodeId: ID!, $comment: String, $ratingState: RatingState) {
    createRecord(
      input: {
        episodeId: $episodeId
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
          records {
            nodes {
              id
            }
          }
        }
      }
    }
  }
`;