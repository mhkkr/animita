import { gql } from '@apollo/client';

export const viewerRecordsGql = gql`
  query viewerRecords {
    viewer {
      records {
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