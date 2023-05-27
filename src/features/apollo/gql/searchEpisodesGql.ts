import { gql } from '@apollo/client';

export const searchEpisodesGql = gql`
  query searchEpisodes($annictIds: [Int!]) {
    searchEpisodes(
      annictIds: $annictIds
    ) {
      nodes {
        annictId
      	sortNumber
				viewerDidTrack
      	numberText
      	title
				records(
					hasComment: true
				) {
					nodes {
						ratingState
						comment
						user {
							name
						}
					}
				}
				work {
					annictId
				}
      }
    }
  }
`;