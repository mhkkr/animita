import { useMutation } from '@apollo/client/react';
import { deleteRecordGql } from '~/features/apollo/gql/mutation/deleteRecordGql';

import { useAtom } from 'jotai';
import { recordDeleteIdAtom } from '~/atoms/recordDeleteIdAtom';
import { recordEditIdAtom } from '~/atoms/recordEditIdAtom';
import type { Record, DeleteRecordMutation, DeleteRecordMutationVariables } from '~/features/apollo/generated-types';

import Icons from '~/components/icons/Icons';

export default function Delete({ record, close }: { record: Record, close: () => void }) {
  const [recordDeleteId, setRecordDeleteId] = useAtom(recordDeleteIdAtom);
  const [recordEditId, setRecordEditId] = useAtom(recordEditIdAtom);

  const [deleteRecord, { loading, error }] = useMutation<DeleteRecordMutation, DeleteRecordMutationVariables>(deleteRecordGql, {
    update(cache, { data }) {
      if (!data?.deleteRecord?.episode) return;
      const episode = data.deleteRecord.episode;
      
      cache.modify({
        id: cache.identify({ id: episode.id, __typename: 'Episode' }),
        fields: {
          recordsCount() {
            // return episode.recordsCount; // なんか値が変わってない？
            return episode.records?.nodes?.length ?? 0;
          }
        }
      });
      
      cache.gc();
    },
    onCompleted() {
      if (recordDeleteId) setRecordDeleteId('');
      if (recordEditId) setRecordEditId('');
    }
  });

  if (error) {
    console.error(error);
    return <p className="text-red-500">{error.message}</p>;
  }

  return (
    <button
      onClick={() => {
        const confirm = window.confirm('本当に削除しますか？');
        if (confirm) {
          setRecordDeleteId(record.id);
          deleteRecord({ variables: { recordId: record.id }});
        }
        close();
      }}
      className={`flex items-center px-2 py-1.5 hover:underline ${loading ? 'cursor-not-allowed grayscale' : ''}`}
      type="button"
      disabled={loading}
    >
      <Icons id="delete" type="form" className="mr-1" />
      削除
    </button>
  );
}