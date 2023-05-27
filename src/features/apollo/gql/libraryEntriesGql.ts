import { gql } from '@apollo/client';

export const libraryEntriesGql = gql`
  query libraryEntries($states: [StatusState!], $seasons: [String!]) {
    viewer {
      libraryEntries(
        states: $states
        seasons: $seasons
      ) {
        nodes {
          status {
            state
          }
          work {
            annictId
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