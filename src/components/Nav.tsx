'use client';

import { useRouter } from 'next/navigation';

import { useRecoilState } from 'recoil';
import { statusStateAtom } from '~/atoms/statusStateAtom';

import StatuSstateIcon from '~/components/icons/StatuSstateIcon';

import Const from '~/constants';

function NavButton({ state }: {
  state: {
    id: string,
    label: string
  }
}) {
  const router = useRouter();
  const [statusState, setStatusState] = useRecoilState(statusStateAtom);

  return (
    <button
      onClick={() => {
        setStatusState(state.id);
        router.push('/');
      }}
      className={`
        relative flex items-center p-3 w-full text-xl rounded-l-full
        after:content-[''] after:block after:absolute after:inset-0 after:border after:border-r-0 dark:after:border-white/25 after:rounded-l-full
        ${statusState === state.id ? 'font-bold' : 'after:hidden'}
        focus-visible:outline-none focus-visible:after:block focus-visible:dark:after:border-white
      `}
      type="button"
    >
      {statusState === state.id ?
        <StatuSstateIcon id={`${state.id}_CURRENT`} className="text-[1.5em] mr-2" /> :
        <StatuSstateIcon id={state.id} className="text-[1.5em] mr-2" />
      }
      <span>{state.label}</span>
    </button>
  );
}

export default function Nav() {
  return (
    <nav>
      <ul>
        {Const.STATUSSTATE_LIST.map(state => {
          return <li key={state.id}><NavButton state={state} /></li>
        })}
      </ul>
    </nav>
  );
}