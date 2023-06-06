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
            noEpisodes
          }
          nextProgram {
            channel {
              name
            }
            startedAt
            episode {
              annictId
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