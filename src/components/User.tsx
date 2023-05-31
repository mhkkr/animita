'use client';

import { Popover, Transition } from '@headlessui/react';
import { signOut, useSession } from 'next-auth/react';

import FormIcon from '~/components/icons/FormIcon';

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
        <Popover.Panel className="absolute bottom-full left-4 right-4 border dark:border-white/25 rounded-xl shadow-xl">
          <button onClick={() => signOut()} className="flex items-center p-3 w-full hover:text-red-500 font-bold" type="button">
            <FormIcon id="logout" className="mr-1.5 text-lg" />
            ログアウト
          </button>
        </Popover.Panel>
      </Transition>
      <Popover.Button className="group/user flex items-center p-3 w-full outline-none">
        <span className="
          mr-3 dark:bg-white rounded-full overflow-hidden w-12 h-12
          group-focus-visible/user:outline group-focus-visible/user:outline-1 group-focus-visible/user:outline-offset-2
        ">
          <img className="object-cover w-full h-full" src={data?.user?.image || ''} alt={`${data?.user?.name}さんのアイコン`} />
        </span>
        <span>{data?.user?.name}</span>
      </Popover.Button>
    </Popover>
  );
}