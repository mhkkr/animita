import { gql } from '@apollo/client';

export const searchEpisodesGql = gql`
  query searchEpisodes($annictIds: [Int!]) {
    searchEpisodes(
      annictIds: $annictIds
    ) {
      nodes {
				id
        annictId
        sortNumber
        numberText
        title
				viewerDidTrack
        viewerRecordsCount
        recordsCount
				records {
					nodes {
						id
						annictId
						ratingState
						comment
						createdAt
						updatedAt
						likesCount
						user {
							annictId
							name
							username
							avatarUrl
						}
					}
				}
				work {
					annictId
        	twitterHashtag
				}
      }
    }
  }
`;