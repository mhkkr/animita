import { gql } from '@apollo/client';

export const libraryEntriesSimpleGql = gql`
  query libraryEntriesSimple($states: [StatusState!], $seasons: [String!]) {
    viewer {
      libraryEntries(
        states: $states
        seasons: $seasons
      ) {
        nodes {
          work {
            id
            annictId
            malAnimeId
            title
            image {
              facebookOgImageUrl
              copyright
            }
          }
        }
      }
    }
  }
`;

