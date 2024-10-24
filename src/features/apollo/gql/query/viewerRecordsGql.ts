import { gql } from '@apollo/client';

export const viewerRecordsGql = gql`
  query viewerRecords($first: Int!) {
    viewer {
      records(first: $first, orderBy: { field: CREATED_AT, direction: DESC }) {
        edges {
          node {
            annictId
            episode {
              title
              numberText
              annictId
              work {
                title
                annictId
              }
            }
          }
        }
      }
    }
  }
`;