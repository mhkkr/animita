import { gql } from '@apollo/client';

export const LibraryEntriesStopWatching = gql`
  query LibraryEntriesStopWatching {
    viewer {
      libraryEntries(
        states: [STOP_WATCHING]
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