import Link from 'next/link';

import LayoutContainer from '~/components/layouts/Container';

import MyMute from '~/components/animes/MyMute';

export const metadata = {
  title: 'マイページ（ミュート）',
};

export default function MyPage() {
  return (
    <LayoutContainer>
      <h1 className="mb-8 px-4 py-3 pt-1 sm:py-3 text-center text-lg font-bold border-b dark:border-stone-700">マイページ</h1>

      <div className="grid grid-cols-2">
        <Link className="flex justify-center p-3 w-full font-bold border-y dark:border-stone-700" href="/mypage">
          エピソード履歴
        </Link>
        <Link className="flex justify-center p-3 w-full font-bold border-y border-l dark:border-stone-700 bg-black/10 dark:bg-white/20" href="/mypage/mute">
          ミュート
        </Link>
      </div>

      <MyMute />
    </LayoutContainer>
  );
}