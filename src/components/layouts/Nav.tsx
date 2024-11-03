'use client';

import { useRouter } from 'next/navigation';

import { useAtom } from 'jotai';
import { statusStateIdAtom } from '~/atoms/statusStateIdAtom';

import Icons from '~/components/icons/Icons';

import Const from '~/constants';

function NavButton({ state }: {
  state: {
    id: string,
    label: string
  }
}) {
  const router = useRouter();
  const [statusStateId, setStatusStateId] = useAtom(statusStateIdAtom);

  return (
    <button
      onClick={() => {
        setStatusStateId(state.id);
        router.push('/');
      }}
      className={`
        relative flex items-center justify-center sm:justify-normal p-3 w-full text-xl sm:rounded-l-full
        sm:after:content-[''] sm:after:block sm:after:absolute sm:after:inset-0 sm:after:border sm:after:border-r-0 dark:sm:after:border-white/25 sm:after:rounded-l-full
        ${statusStateId === state.id ? 'font-bold' : 'sm:after:hidden'}
        sm:focus-visible:outline-none sm:focus-visible:after:block sm:focus-visible:dark:after:border-white
      `}
      type="button"
    >
      {statusStateId === state.id ?
        <Icons id={`${state.id}_CURRENT`} type="status_state" className="text-[1.5em] mr-2" /> :
        <Icons id={state.id} type="status_state" className="text-[1.5em] mr-2" />
      }
      <span className="hidden sm:block">{state.label}</span>
    </button>
  );
}

export default function Nav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t sm:border-t-0 dark:border-stone-700 dark:bg-black/60 backdrop-blur-md sm:bg-inherit sm:backdrop-blur-none sm:static">
      <ul className="grid grid-cols-5 sm:block">
        {Const.STATUS_STATE_LIST.map(state => <li key={state.id}><NavButton state={state} /></li>)}
      </ul>
    </nav>
  );
}