import { gql } from '@apollo/client';

export const deleteRecordGql = gql`
  mutation deleteRecord($recordId: ID!) {
    deleteRecord(
      input: {
        recordId: $recordId
      }
    ) {
      episode {
        id
        viewerRecordsCount
        viewerDidTrack
        recordsCount
				records {
					nodes {
						id
					}
				}
      }
    }
  }
`;