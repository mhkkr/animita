import Image from 'next/image';

import Logout from '~/features/oauth/components/Logout';

type typeNavButton = {
  icon: string,
  label: string,
  id: string
};
function NavButton({ state }: { state: typeNavButton }) {
  return (
    <button type="button">{state.label}</button>
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
  return (
    <nav>
      <div className="max-w-5xl mx-auto">
        <ul className="flex">
          {stateList.map(state => {
            return <li key={state.id}><NavButton state={state} /></li>
          })}
        </ul>
      </div>
    </nav>
  );
}

export default function Header() {
  return (
    <>
      <header>
        <div className="max-w-5xl mx-auto flex gap-4">
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
          <div>
            検索
          </div>
          <div>
            通知
          </div>
          <div>
            <button className="block p-4 bg-black/50 text-white" type="button">ユーザー</button>
          </div>
        </div>
      </header>
      <Nav />
    </>
  );
}