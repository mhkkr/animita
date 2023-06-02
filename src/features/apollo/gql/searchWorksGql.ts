import { gql } from '@apollo/client';

export const searchWorksGql = gql`
  query searchWorks($annictIds: [Int!]) {
    searchWorks(
      annictIds: $annictIds
    ) {
      nodes {
        id
        annictId
        watchersCount
        reviewsCount
        twitterHashtag
        seasonName
        seasonYear
        officialSiteUrl
        title
        media
        image {
          facebookOgImageUrl
          copyright
        }
        episodes {
          nodes {
            id
            annictId
            sortNumber
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
						}
					}
				}
      }
    }
  }
`;