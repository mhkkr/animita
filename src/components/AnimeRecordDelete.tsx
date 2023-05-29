'use client';

import { useMutation, gql } from '@apollo/client';
import { libraryEntriesGql } from '~/features/apollo/gql/libraryEntriesGql';
import { searchEpisodesGql } from '~/features/apollo/gql/searchEpisodesGql';
import { searchWorksGql } from '~/features/apollo/gql/searchWorksGql';

export default function Delete({ recordId }: { recordId: string }) {
  const [deleteRecord, { loading, error }] = useMutation(gql`
    mutation deleteRecord($recordId: ID!) {
      deleteRecord(
        input: {
          recordId: $recordId
        }
      ) {
        episode {
          annictId
        }
      }
    }
  `, {
    refetchQueries: [
      'searchEpisodesGql',
      'searchWorksGql'
    ]
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
      <span className="material-symbols-outlined !text-[1em] mr-1">delete</span>
      削除
    </button>
  );
}