import { gql, type TypedDocumentNode } from '@apollo/client';

import type { SearchEpisodesQuery, SearchEpisodesQueryVariables } from '~/features/apollo/generated-types';

export const searchEpisodesGql: TypedDocumentNode<SearchEpisodesQuery, SearchEpisodesQueryVariables> = gql`
  query searchEpisodes($annictIds: [Int!]) {
    searchEpisodes(
      annictIds: $annictIds
    ) {
      nodes {
				id
        annictId
        sortNumber
        number
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