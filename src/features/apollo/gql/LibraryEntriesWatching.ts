import { gql } from '@apollo/client';

export const LibraryEntriesWatching = gql`
  query LibraryEntriesWatching {
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