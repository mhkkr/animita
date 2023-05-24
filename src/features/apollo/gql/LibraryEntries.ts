import { gql } from '@apollo/client';

export const LibraryEntries = gql`
  query LibraryEntries {
    viewer {
      libraryEntries(
        states: [WATCHING, WANNA_WATCH, WATCHED, ON_HOLD, STOP_WATCHING]
      ) {
        nodes {
          status {
            state
          }
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