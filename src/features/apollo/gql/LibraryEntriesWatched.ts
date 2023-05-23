import { gql } from '@apollo/client';

export const LibraryEntriesWatched = gql`
  query LibraryEntriesWatched {
    viewer {
      libraryEntries(
        states: [WATCHED]
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