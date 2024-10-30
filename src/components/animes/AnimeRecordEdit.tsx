import { useSetRecoilState } from 'recoil';
import { recordEditIdAtom } from '~/atoms/recordEditIdAtom';
import { Record } from '~/features/apollo/generated-types';

import Icons from '~/components/icons/Icons';

export default function Edit({ record, close }: { record: Record, close: () => void }) {
  const setRecordEditId = useSetRecoilState(recordEditIdAtom);

  return (
    <button
      onClick={() => {
        setRecordEditId(record.id);
        close();
      }}
      className="flex items-center px-2 py-1.5 hover:underline"
      type="button"
    >
      <Icons id="edit" type="form" className="mr-1" />
      変更
    </button>
  );
}