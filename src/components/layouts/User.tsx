'use client';

import Link from 'next/link';

import { Popover, PopoverPanel, PopoverButton, Transition } from '@headlessui/react';
import { signOut, useSession } from 'next-auth/react';

import Icons from '~/components/icons/Icons';

export default function User() {
  const { data } = useSession();

  return (
    <Popover className="relative">
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <PopoverPanel className="absolute top-10 sm:top-auto sm:bottom-full right-0 sm:right-auto border dark:border-white/25 bg-white dark:bg-black rounded-xl overflow-hidden shadow-xl whitespace-nowrap">
          <Link className="flex items-center p-3 w-full font-bold border-b dark:border-white/25" href="/mypage">
            マイページ
          </Link>
          <Link className="flex items-center p-3 w-full font-bold border-b dark:border-white/25" href="/howto">
          初期設定
          </Link>
          <Link className="flex items-center p-3 w-full font-bold border-b dark:border-white/25" href="/todo">
          やり残しと更新履歴
          </Link>
          <button onClick={() => signOut()} className="flex items-center p-3 w-full text-red-500 font-bold" type="button">
            <Icons id="logout" type="form" className="flex-shrink-0 mr-1.5 text-lg" />
            ログアウト
          </button>
        </PopoverPanel>
      </Transition>
      <PopoverButton className="group/user flex items-center gap-3 sm:p-3 w-full outline-none">
        <span className="
          order-last sm:order-none
          dark:bg-white rounded-full overflow-hidden w-8 h-8 sm:w-12 sm:h-12
          group-focus-visible/user:outline group-focus-visible/user:outline-1 group-focus-visible/user:outline-offset-2
        ">
          <img className="object-cover w-full h-full" src={data?.user?.image || ''} alt={`${data?.user?.name}さんのアイコン`} />
        </span>
        <span>{data?.user?.name}</span>
      </PopoverButton>
    </Popover>
  );
}