import { gql } from '@apollo/client';

export const createRecordGql = gql`
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