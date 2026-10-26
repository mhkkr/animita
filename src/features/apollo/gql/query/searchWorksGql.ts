import { gql, type TypedDocumentNode } from '@apollo/client';

import type { SearchWorksQuery, SearchWorksQueryVariables } from '~/features/apollo/generated-types';

export const searchWorksGql: TypedDocumentNode<SearchWorksQuery, SearchWorksQueryVariables> = gql`
  query searchWorks($annictIds: [Int!]) {
    searchWorks(
      annictIds: $annictIds
    ) {
      nodes {
        id
        annictId
        malAnimeId
        watchersCount
        reviewsCount
        twitterHashtag
        seasonName
        seasonYear
        officialSiteUrl
        title
        media
        viewerStatusState
        image {
          facebookOgImageUrl
        }
				staffs {
					nodes {
						name
						roleText
					}
				}
				casts {
					nodes {
            person {
              annictId
						  name
							nameKana
						}
						character {
							name
						}
					}
				}
        episodes {
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
          }
        }
        programs {
					nodes {
						startedAt
						channel {
							annictId
							name
							channelGroup {
								name
							}
						}
					}
				}
      }
    }
  }
`;