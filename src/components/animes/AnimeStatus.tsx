'use client';

import { useState } from 'react';

import { Listbox, ListboxOptions, ListboxOption, ListboxButton } from '@headlessui/react';

import { useQuery, useMutation } from '@apollo/client';
import { libraryEntriesGql } from '~/features/apollo/gql/query/libraryEntriesGql';
import { updateStatusGql } from '~/features/apollo/gql/mutation/updateStatusGql';
import type { Work, LibraryEntriesQuery } from '~/features/apollo/generated-types';

import { useAtom } from 'jotai';
import { statusStateIdAtom } from '~/atoms/statusStateIdAtom';

import Icons from '~/components/icons/Icons';
import { RingSpinner } from '~/components/spinners/Spinner';

import Const from '~/constants';

const statusStateIdArray: string[] = [];
Const.STATUS_STATE_LIST.map(state => statusStateIdArray.push(state.id));

type State = {
  id: string,
  label: string
};

export default function Status({ work }: { work: Work }) {
  const [statusStateId, setStatusStateId] = useAtom(statusStateIdAtom);

  const { data, loading: ll, error: le } = useQuery<LibraryEntriesQuery>(libraryEntriesGql, {
    variables: {
      states: statusStateIdArray,
      seasons: [`${work.seasonYear}-${work.seasonName?.toLowerCase()}`]
    }
  });
  const entry = data?.viewer?.libraryEntries?.nodes?.find(node => node?.work.annictId === work.annictId);
  const state = Const.STATUS_STATE_LIST.find(state => state.id === entry?.status?.state);
  const [changeStatusState, setChangeStatusState] = useState<State | undefined>(state);

  const [updateStatus, { loading: ul, error: ue }] = useMutation(updateStatusGql);
  
  if (ll || ul) return <div className="text-center text-3xl text-annict-100"><RingSpinner /></div>;
  if (le || ue) { console.error(le || ue); return <p className="text-red-500">{le?.message || ue?.message}</p>; }


  return (
    <Listbox value={changeStatusState} onChange={setChangeStatusState}>
      <ListboxButton className="flex items-center justify-center w-full pr-4 pl-3 py-2 bg-black text-white dark:bg-white dark:text-gray-900 rounded-lg">
        {!changeStatusState && !state ?
          <span>未選択</span> :
          <>
            <Icons id={`${changeStatusState ? changeStatusState.id : state?.id}_CURRENT`} type="status_state" className="text-[1.5em] mr-2" />
            <span>{changeStatusState ? changeStatusState.label : state?.label}</span>
          </>
        }
      </ListboxButton>
      <ListboxOptions
        anchor="bottom"
        transition
        className="mt-2 w-[calc(100%_-_2rem)] sm:w-auto border dark:border-white/25 bg-white dark:bg-black rounded-lg overflow-hidden [contain:content] shadow-xl origin-top transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        {Const.STATUS_STATE_LIST.map((state) => (
          <ListboxOption
            key={state.id}
            onClick={async () => {
              const result = await updateStatus({ variables: { state: state.id, workId: work.id }});
              if (result) {
                setStatusStateId(state.id);
                setChangeStatusState(state);
              }
            }}
            value={state}
            disabled={ul}
            className={`
              flex items-center p-2 w-full cursor-pointer
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