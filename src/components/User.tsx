'use client';

// TODO: キャッシュする

import { useQuery } from '@apollo/client';
import { userGql } from '~/features/apollo/gql/userGql';
import type { UserQuery } from '~/features/apollo/generated-types';

import { Popover, Transition } from '@headlessui/react';

import { signOut } from 'next-auth/react';

export default function User() {
  const { data, loading, error } = useQuery<UserQuery>(userGql);

  if (error) return <p className="p-3 w-full dark:text-white/70">{error.message}</p>

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
            <span className="mr-1.5 material-symbols-outlined">logout</span>
            ログアウト
          </button>
        </Popover.Panel>
      </Transition>
      <Popover.Button className="group/user flex items-center p-3 w-full outline-none">
        <span className="
          mr-3 dark:bg-white rounded-full overflow-hidden w-12 h-12
          group-focus-visible/user:outline group-focus-visible/user:outline-1 group-focus-visible/user:outline-offset-2
        ">
          {loading ? 
            <span className="material-symbols-outlined material-symbols-outlined--fill dark:text-stone-800 !text-5xl">face</span> :
            <img className="object-cover w-full h-full" src={data?.viewer?.avatarUrl || ''} alt="ユーザーアイコン" />
          }
        </span>
        <span>{data?.viewer?.username}</span>
      </Popover.Button>
    </Popover>
  );
}