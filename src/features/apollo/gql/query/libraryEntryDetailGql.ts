import { gql, type TypedDocumentNode } from "@apollo/client";

import type {
  LibraryEntryDetailQuery,
  LibraryEntryDetailQueryVariables,
} from "~/features/apollo/generated-types";

/** 詳細ページ用: 視聴状態と nextProgram のみ（重い work 配下は searchWorks 側を使う） */
export const libraryEntryDetailGql: TypedDocumentNode<
  LibraryEntryDetailQuery,
  LibraryEntryDetailQueryVariables
> = gql`
  query libraryEntryDetail($states: [StatusState!], $seasons: [String!]) {
    viewer {
      id
      libraryEntries(
        states: $states
        seasons: $seasons
      ) {
        nodes {
          id
          note
          status {
            state
          }
          work {
            annictId
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
        }
      }
    }
  }
`;
