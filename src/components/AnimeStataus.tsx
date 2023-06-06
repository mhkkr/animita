'use client';

import { useEffect, useState } from 'react';

import { Listbox, Transition } from '@headlessui/react';

import { useQuery, useMutation } from '@apollo/client';
import { libraryEntriesGql } from '~/features/apollo/gql/query/libraryEntriesGql';
import { updateStatusGql } from '~/features/apollo/gql/mutation/updateStatusGql';
import type { Work, LibraryEntriesQuery } from '~/features/apollo/generated-types';

import { useRecoilState } from 'recoil';
import { statusStateIdAtom } from '~/atoms/statusStateIdAtom';

import Icons from '~/components/icons/Icons';

import Const from '~/constants';

const statusStateIdArray: string[] = [];
Const.STATUSSTATE_LIST.map(state => statusStateIdArray.push(state.id));

type State = {
  id: string,
  label: string
};

export default function Stataus({ work }: { work: Work }) {
  const [changeStatusState, setChangeStatusState] = useState<State>();
  const [statusStateId, setStatusStateId] = useRecoilState(statusStateIdAtom);

  const { data, loading: ll, error: le } = useQuery<LibraryEntriesQuery>(libraryEntriesGql, {
    variables: {
      states: statusStateIdArray,
      seasons: [`${work.seasonYear}-${work.seasonName?.toLowerCase()}`]
    }
  });
  const entry = data?.viewer?.libraryEntries?.nodes?.find(node => node?.work.annictId === work.annictId);

  const [updateStatus, { loading: ul, error: ue }] = useMutation(updateStatusGql);
  
  if (ll || ul) return <></>;
  if (le || ue) { console.error(le || ue); return <p className="text-red-500">{le?.message || ue?.message}</p>; }

  const state = Const.STATUSSTATE_LIST.find(state => state.id === entry?.status?.state);

  return (
    <Listbox>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Listbox.Options className="absolute bottom-full mb-2 -left-2 -right-2 border dark:border-white/25 bg-white dark:bg-black rounded-xl overflow-hidden shadow-xl">
          {Const.STATUSSTATE_LIST.map(state => {
            return (
              <Listbox.Option
                key={state.id}
                value={state}
                disabled={ul}
              >
                <button
                  onClick={async () => {
                    const result = await updateStatus({ variables: { state: state.id, workId: work.id }});
                    if (result) {
                      setStatusStateId(state.id);
                      setChangeStatusState(state);
                    }
                  }}
                  className={`
                    flex items-center p-2 w-full
                    ${statusStateId === state.id ? 'font-bold' : ''}
                  `}
                  type="button"
                >
                  {statusStateId === state.id ?
                    <Icons id={`${state.id}_CURRENT`} type="status_state" className="text-[1.5em] mr-2" /> :
                    <Icons id={state.id} type="status_state" className="text-[1.5em] mr-2" />
                  }
                  <span>{state.label}</span>
                </button>
              </Listbox.Option>
            );
          })}
        </Listbox.Options>
      </Transition>
      <Listbox.Button className="flex items-center justify-center w-full pr-4 pl-3 py-2 bg-black text-white dark:bg-white dark:text-gray-900 rounded-lg">
        <Icons id={`${changeStatusState ? changeStatusState.id : state?.id}_CURRENT`} type="status_state" className="text-[1.5em] mr-2" />
        <span>{changeStatusState ? changeStatusState.label : state?.label}</span>
      </Listbox.Button>
    </Listbox>
  )
}