import Link from 'next/link';

import { Popover, PopoverPanel, PopoverButton } from '@headlessui/react';
import { signOut, useSession } from 'next-auth/react';

import Icons from '~/components/icons/Icons';

export default function User() {
  const { data } = useSession();

  return (
    <Popover className="relative">
      <PopoverPanel
        transition
        className="absolute top-10 sm:top-auto sm:bottom-full right-0 sm:right-auto border dark:border-stone-700 bg-white dark:bg-black rounded-lg overflow-hidden [contain:content] shadow-xl whitespace-nowrap origin-top transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <Link className="flex items-center p-3 w-full font-bold border-b dark:border-stone-700" href="/mypage">
          マイページ
        </Link>
        <Link className="flex items-center p-3 w-full font-bold border-b dark:border-stone-700" href="/howto">
          初期設定
        </Link>
        <Link className="flex items-center p-3 w-full font-bold border-b dark:border-stone-700" href="/todo">
          更新履歴
        </Link>
        <button onClick={() => signOut()} className="flex items-center p-3 w-full text-red-500 font-bold" type="button">
          <Icons id="logout" type="form" className="flex-shrink-0 mr-1.5 text-lg" />
          ログアウト
        </button>
      </PopoverPanel>
      <PopoverButton className="group/user flex items-center gap-3 sm:p-3 w-full outline-none">
        <span className="
          order-last sm:order-none
          dark:bg-white rounded-full overflow-hidden [contain:content] w-8 h-8 sm:w-12 sm:h-12
          group-focus-visible/user:outline group-focus-visible/user:outline-1 group-focus-visible/user:outline-offset-2
        ">
          <img className="object-cover w-full h-full" src={data?.user?.image || ''} alt={`${data?.user?.name}さんのアイコン`} />
        </span>
        <span>{data?.user?.name}</span>
      </PopoverButton>
    </Popover>
  );
}