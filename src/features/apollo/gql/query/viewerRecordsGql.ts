import { gql, type TypedDocumentNode } from '@apollo/client';

import type { ViewerRecordsQuery, ViewerRecordsQueryVariables } from '~/features/apollo/generated-types';

export const viewerRecordsGql: TypedDocumentNode<ViewerRecordsQuery, ViewerRecordsQueryVariables> = gql`
  query viewerRecords($first: Int!) {
    viewer {
      id
      records(first: $first, orderBy: { field: CREATED_AT, direction: DESC }) {
        edges {
          node {
            id
            annictId
						ratingState
            episode {
              title
              number
              annictId
              work {
                title
                annictId
                viewerStatusState
              }
            }
          }
        }
      }
    }
  }
`;