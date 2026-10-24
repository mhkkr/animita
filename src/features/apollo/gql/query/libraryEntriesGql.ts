import { gql, type TypedDocumentNode } from "@apollo/client";

import type {
  LibraryEntriesQuery,
  LibraryEntriesQueryVariables,
} from "~/features/apollo/generated-types";

export const libraryEntriesGql: TypedDocumentNode<
  LibraryEntriesQuery,
  LibraryEntriesQueryVariables
> = gql`
  query libraryEntries($states: [StatusState!], $seasons: [String!]) {
    viewer {
      id
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
          }
          nextProgram {
            channel {
              annictId
              name
            }
            startedAt
            episode {
              annictId
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
