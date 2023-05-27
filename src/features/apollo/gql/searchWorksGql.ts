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
						viewerDidTrack
            numberText
            title
            viewerRecordsCount
          }
        }
        programs {
					nodes {
						# startedAt
            # Cannot return null for non-nullable field Program.episode が出て data が取得できなくなる…。
						# episode {
						# 	annictId
						# }
						channel {
							annictId
							name
							# published
						}
					}
				}
      }
    }
  }
`;