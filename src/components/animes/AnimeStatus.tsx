'use client';

import { useState } from 'react';

import { Listbox, ListboxOptions, ListboxOption, ListboxButton } from '@headlessui/react';

import { useMutation } from '@apollo/client/react';
import { updateStatusGql } from '~/features/apollo/gql/mutation/updateStatusGql';
import type { StatusState, Work } from '~/features/apollo/generated-types';
import type { LibraryEntriesData } from '~/types/libraryEntries';

import { useAtom } from 'jotai';
import { statusStateIdAtom } from '~/atoms/statusStateIdAtom';

import Icons from '~/components/icons/Icons';
import { RingSpinner } from '~/components/spinners/Spinner';

import Const from '~/constants';

type State = {
  id: string,
  label: string,
  color?: string,
  bgColor?: string,
};

const NO_STATUS: State = { id: "NO_STATE", label: "未選択" };
const STATUS_CHOICES = [NO_STATUS, ...Const.STATUS_STATE_LIST];

function resolveStatus(statusId?: string | null): State {
  if (!statusId || statusId === NO_STATUS.id) {
    return NO_STATUS;
  }
  return Const.STATUS_STATE_LIST.find((state) => state.id === statusId) ?? NO_STATUS;
}

export default function Status({ work, libraryEntries }: { work: Work, libraryEntries?: LibraryEntriesData }) {
  const [statusStateId, setStatusStateId] = useAtom(statusStateIdAtom);

  const entry = libraryEntries?.viewer?.libraryEntries?.nodes?.find(node => node?.work.annictId === work.annictId);
  const statusId = entry?.status?.state ?? work.viewerStatusState;
  const [changeStatusState, setChangeStatusState] = useState<State | undefined>();
  // 変更前はサーバーのステータスを使う。未選択もボタンに出す。
  const displayState = changeStatusState ?? resolveStatus(statusId);

  const [updateStatus, { loading: ul, error: ue }] = useMutation(updateStatusGql);

  const buttonClass = displayState.bgColor
    ? `${displayState.bgColor} text-white`
    : "bg-black text-white dark:bg-white dark:text-gray-900";

  if (ul) return <div className="text-center text-3xl text-annict-100"><RingSpinner /></div>;
  if (ue) return <p className="text-red-500">{ue.message}</p>;

  return (
    <Listbox value={displayState} onChange={setChangeStatusState}>
      <ListboxButton className={`flex items-center justify-center w-full pr-4 pl-3 py-2 rounded-lg ${buttonClass}`}>
        <Icons id={`${displayState.id}_CURRENT`} type="status_state" className="text-[1.5em] mr-2" />
        <span>{displayState.label}</span>
      </ListboxButton>
      <ListboxOptions
        anchor="bottom"
        transition
        className="mt-2 w-[calc(100%_-_2rem)] sm:w-auto border dark:border-white/25 bg-white dark:bg-black rounded-lg overflow-hidden shadow-xl origin-top transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        {STATUS_CHOICES.map((state) => (
          <ListboxOption
            key={state.id}
            onClick={async () => {
              const result = await updateStatus({ variables: { state: state.id as StatusState, workId: work.id }});
              if (result) {
                setStatusStateId(state.id);
                setChangeStatusState(state);
              }
            }}
            value={state}
            disabled={ul}
            className={`
              flex items-center p-2 w-full cursor-pointer
              hover:bg-stone-200 data-[focus]:bg-stone-200
              dark:hover:bg-white/20 dark:data-[focus]:bg-white/20
              ${statusStateId === state.id ? 'font-bold' : ''}
            `}
          >
            {statusStateId === state.id ?
              <Icons id={`${state.id}_CURRENT`} type="status_state" className="text-[1.5em] mr-2" /> :
              <Icons id={state.id} type="status_state" className="text-[1.5em] mr-2" />
            }
            <span>{state.label}</span>
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )
}