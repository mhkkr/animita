'use client';

import { useMutation, gql } from '@apollo/client';

import Icons from '~/components/icons/Icons';

export default function Delete({ recordId }: { recordId: string }) {
  const [deleteRecord, { loading, error }] = useMutation(gql`
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
  `, {
    update(cache, { data: { deleteRecord } }) {
      cache.evict({ id: cache.identify(deleteRecord) });
      cache.gc();

      cache.modify({
        id: cache.identify({ id: deleteRecord.episode.id, __typename: 'Episode' }),
        fields: {
          viewerRecordsCount() {
            return deleteRecord.episode.viewerRecordsCount;
          },
          viewerDidTrack() {
            return deleteRecord.episode.viewerDidTrack;
          },
          recordsCount() {
            // return deleteRecord.episode.recordsCount; // なんか値が変わってない？
            return deleteRecord.episode.records.nodes.length;
          }
        }
      });
    }
  });

  if (error) {
    console.error(error);
    return <p className="px-4 mb-6 py-6 dark:text-white/70 border-y dark:border-white/25">{error.message}</p>;
  }

  return (
    <button
      onClick={() => deleteRecord({ variables: { recordId: recordId }})}
      className={`inline-flex items-center ${loading ? 'cursor-not-allowed grayscale' : ''}`}
      type="button"
      disabled={loading}
    >
      <Icons id="delete" type="form" className="mr-1" />
      削除
    </button>
  );
}