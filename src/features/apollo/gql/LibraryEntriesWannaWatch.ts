import { gql } from '@apollo/client';

export const LibraryEntriesWannaWatch = gql`
  query LibraryEntriesWatching {
    viewer {
      libraryEntries(
        states: [WANNA_WATCH]
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