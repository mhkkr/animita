import { gql } from '@apollo/client';

export const viewerRecordsGql = gql`
  query viewerRecords {
    viewer {
      records(first: 100, orderBy: { field: CREATED_AT, direction: DESC }) {
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