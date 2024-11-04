'use client';

import { useState } from 'react';

import { getMal } from '~/libs/mal';

import Icons from '~/components/icons/Icons';

import Const from '~/constants';

export default function MyMal() {
  const [mal, setMal] = useState(getMal());

  const handleClick = () => {
    const confirm = window.confirm('本当に削除しますか？');
    if (confirm) {
      localStorage.removeItem(Const.STORAGE_MAL);
      setMal(getMal());
    }
  };

  return (
    <dl className="flex gap-4 items-center">
      <dt className="flex-none">
        <p>MyAnimeList</p>
        <p className="text-xs dark:text-white/70">{mal.length}件のデータを取得済み。</p>
      </dt>
      <dd className="ml-auto">
        <button
          onClick={handleClick}
          className="flex items-center justify-center w-full pr-4 pl-3 py-2 bg-black text-white dark:bg-white dark:text-gray-900 rounded-lg"
          type="button"
        >
          <Icons id="delete" type="form" className="mr-1" />
          削除
        </button>
      </dd>
    </dl>
  );
}