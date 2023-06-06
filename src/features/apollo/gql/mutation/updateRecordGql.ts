import { gql } from '@apollo/client';

export const updateRecordGql = gql`
  mutation updateRecord($recordId: ID!, $comment: String, $ratingState: RatingState, $shareTwitter: Boolean) {
    updateRecord(
      input: {
        recordId: $recordId
        comment: $comment
        ratingState: $ratingState
        shareTwitter: $shareTwitter
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
					email
					name
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