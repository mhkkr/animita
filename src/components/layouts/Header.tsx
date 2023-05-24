'use client';

import Image from 'next/image';

import { useRecoilState, useSetRecoilState } from 'recoil';
import { statusStateAtom } from '~/atoms/statusStateAtom';

import Logout from '~/features/oauth/components/Logout';

type typeNavButton = {
  icon: string,
  label: string,
  id: string
};
function NavButton({ state }: { state: typeNavButton }) {
  const setStatusState = useSetRecoilState(statusStateAtom);

  return (
    <button onClick={() => setStatusState(state.id)} type="button">{state.label}</button>
  );
}

const stateList = [
  { icon: '', label: '見てる', id: 'WATCHING' },
  { icon: '', label: '見たい', id: 'WANNA_WATCH' },
  { icon: '', label: '見た', id: 'WATCHED' },
  { icon: '', label: '中断', id: 'ON_HOLD' },
  { icon: '', label: '中止', id: 'STOP_WATCHING' }
];
function Nav() {
  const [statusState] = useRecoilState(statusStateAtom);

  return (
    <nav>
      <ul>
        {stateList.map(state => {
          return <li className={`${statusState === state.id ? 'font-bold' : ''}`} key={state.id}><NavButton state={state} /></li>
        })}
      </ul>
    </nav>
  );
}

export default function Header() {
  return (
    <>
      <header>
          <h1 className="mr-auto">
            ロゴ
            {/* <Image
              className="mx-auto"
              src="/mitabit-home.png"
              width={336 * .3}
              height={420 * .3}
              alt={process.env.NEXT_PUBLIC_TITLE || ''}
            /> */}
          </h1>
          <Nav />
          <div>
            <button className="block p-4 bg-black/50 text-white" type="button">ユーザー</button>
          </div>
      </header>
    </>
  );
}