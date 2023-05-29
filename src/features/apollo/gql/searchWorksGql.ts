import { gql } from '@apollo/client';

export const searchWorksGql = gql`
  query searchWorks($annictIds: [Int!]) {
    searchWorks(
      annictIds: $annictIds
    ) {
      nodes {
        watchersCount
        reviewsCount
        twitterHashtag
        seasonName
        seasonYear
        annictId
        officialSiteUrl
        title
        media
        image {
          facebookOgImageUrl
          copyright
        }
        episodes {
          nodes {
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