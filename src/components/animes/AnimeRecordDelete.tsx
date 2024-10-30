import { useMutation } from '@apollo/client';
import { deleteRecordGql } from '~/features/apollo/gql/mutation/deleteRecordGql';

import { useRecoilState } from 'recoil';
import { recordDeleteIdAtom } from '~/atoms/recordDeleteIdAtom';
import { recordEditIdAtom } from '~/atoms/recordEditIdAtom';
import { Record } from '~/features/apollo/generated-types';

import Icons from '~/components/icons/Icons';

export default function Delete({ record, close }: { record: Record, close: () => void }) {
  const [recordDeleteId, setRecordDeleteId] = useRecoilState(recordDeleteIdAtom);
  const [recordEditId, setRecordEditId] = useRecoilState(recordEditIdAtom);

  const [deleteRecord, { loading, error }] = useMutation(deleteRecordGql, {
    update(cache, { data: { deleteRecord } }) {
      cache.evict({ id: cache.identify(deleteRecord) });
      cache.gc();

      cache.modify({
        id: cache.identify({ id: deleteRecord.episode.id, __typename: 'Episode' }),
        fields: {
          recordsCount() {
            // return deleteRecord.episode.recordsCount; // なんか値が変わってない？
            return deleteRecord.episode.records.nodes.length;
          }
        }
      });
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