import { gql } from '@apollo/client';

export const libraryEntriesGql = gql`
  query libraryEntries($states: [StatusState!], $seasons: [String!]) {
    viewer {
      libraryEntries(
        states: $states
        seasons: $seasons
      ) {
        nodes {
          id
          status {
            state
          }
          work {
            annictId
						malAnimeId
            title
            image {
              facebookOgImageUrl
              copyright
            }
            episodes {
              nodes {
                annictId
                sortNumber
                viewerDidTrack
              }
            }
            programs {
              nodes {
                startedAt
                channel {
                  annictId
                }
              }
            }
          }
          nextProgram {
            channel {
							annictId
              name
            }
            startedAt
            episode {
              annictId
              number
              numberText
              title
            }
          }
          note
        }
      }
    }
  }
`;