import { gql } from '@apollo/client';

export const LibraryEntriesOnHold = gql`
  query LibraryEntriesOnHold {
    viewer {
      libraryEntries(
        states: [ON_HOLD]
      ) {
        nodes {
          work {
            annictId
            officialSiteUrl
            title
            media
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