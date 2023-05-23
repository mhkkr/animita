import { gql } from '@apollo/client';

export const LibraryEntries_WATCHING = gql`
  query LibraryEntries_WATCHING {
    viewer {
      libraryEntries(
        states: [WATCHING]
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