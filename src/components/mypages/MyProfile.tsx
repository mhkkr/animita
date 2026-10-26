'use client';

import Link from 'next/link';

import { useQuery } from '@apollo/client/react';
import { viewerUserGql } from '~/features/apollo/gql/query/viewerUserGql';
import type { ViewerUserQuery } from '~/features/apollo/generated-types';

import DisplayDate from '~/components/dates/DisplayDate';

import Icons from '~/components/icons/Icons';

import { RingSpinner } from '~/components/spinners/Spinner';

import Const from '~/constants';
import { libraryTabHref } from '~/libs/libraryTab';

export default function MyProfile() {
  const { data: user, loading: ul, error: ue } = useQuery(viewerUserGql);

  if (ul) return <div className="p-8 text-center text-5xl text-annict-100"><RingSpinner /></div>;
  if (ue) return <p className="p-8 text-red-500">{ue?.message}</p>;

  if (user) {
    return (
      <div className="p-4">
        <User user={user} />
        <div className="mt-4"><Profile user={user} /></div>
        <div className="mt-4"><Communication user={user} /></div>
        <div className="mt-2 lg:mt-4"><Records user={user} /></div>
      </div>
    );
  }
}

function User({ user }: { user: ViewerUserQuery }) {
  return (
    <figure className="flex items-center gap-3">
      <div className="shrink-0 rounded-full overflow-hidden w-16 h-16">
        <img className="object-cover w-full h-full" src={user.viewer?.avatarUrl || ''} alt="" loading="lazy" />
      </div>
      <div className="flex-1 flex flex-col lg:flex-row lg:items-center gap-3">
        <figcaption className="flex-1 break-all">
          <p className="text-lg leading-tight">{user.viewer?.name}</p>
          <p className="text-sm opacity-70">@{user.viewer?.username}</p>
        </figcaption>
        <p className="shrink-0 lg:ml-auto">
          <a className="inline-flex items-center gap-1 border rounded-full py-1.5 px-3 text-sm dark:border-stone-500 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black" href={`https://annict.com/@${user.viewer?.username}`} target="_blank" rel="noopener noreferrer" title="Annict のユーザーページへ">
            Annict の ユーザーページへ
            <Icons id="open_in_new" type="link" className="text-[1.25em]" />
          </a>
        </p>
      </div>
    </figure>
  );
}

function Profile({ user }: { user: ViewerUserQuery }) {
  return (
    <div className="grid gap-1 text-sm">
      {user.viewer?.description && (
        <p>{user.viewer?.description}</p>
      )}
      {user.viewer?.url && (
        <p>
          <a className="inline-flex gap-1 break-all hover:underline" href={user.viewer?.url} target="_blank" rel="noopener noreferrer">
            <Icons id="open_in_new" type="link" className="shrink-0 relative top-0.5 text-[1.25em]" />
            {user.viewer?.url}
          </a>
        </p>
      )}
      <p className="flex">
        <span className="shrink-0">サービス開始日時：</span>
        <span className="flex flex-wrap gap-x-2">
          <span><DisplayDate date={user.viewer?.createdAt} /></span>
          <span>【{Math.abs(Math.floor((new Date(user.viewer?.createdAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}日目】</span>
        </span>
      </p>
    </div>
  );
}

function Card(
  { direction, url, id, type, label, value, external }:
  { direction?: string, url: string, id: string, type: string, label: string, value: number | null | undefined, external?: boolean }
) {
  const className = `relative flex ${direction === "col" ? "flex-col" : "items-center"} gap-2 p-2.5 lg:p-3 border dark:border-stone-500 rounded-md hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black`;
  const body = (
    <>
      {external && <Icons id="open_in_new" type="link" className="absolute top-2.5 lg:top-3 right-2" />}
      <h2 className={`flex gap-1.5 text-sm lg:text-base ${external ? "pr-5" : ""}`}>
        <Icons id={id} type={type} className="shrink-0" />
        <span className="leading-trim">{label}</span>
      </h2>
      <div className={`${direction === "col" ? "grow" : "ml-auto text-right"} flex items-center justify-center break-all`}>
        <p className="leading-trim whitespace-nowrap text-xl lg:text-3xl font-bold">{value ?? 0}</p>
      </div>
    </>
  );
  if (external) {
    return (
      <a className={className} href={url} target="_blank" rel="noopener noreferrer">
        {body}
      </a>
    );
  }
  return (
    <Link className={className} href={url}>
      {body}
    </Link>
  );
}

function Communication({ user }: { user: ViewerUserQuery }) {
  return (
    <div className="grid gap-2 lg:gap-4 grid-cols-3">
      <Card external url="https://annict.com/notifications" id="bell" type="notification" label="通知" value={user.viewer?.notificationsCount} direction="col" />
      <Card external url={`https://annict.com/@${user.viewer?.username}/following`} id="reguser" type="notification" label="フォロイー" value={user.viewer?.followingsCount} direction="col" />
      <Card external url={`https://annict.com/@${user.viewer?.username}/followers`} id="user" type="notification" label="フォロワー" value={user.viewer?.followersCount} direction="col" />
    </div>
  );
}

function Records({ user }: { user: ViewerUserQuery }) {
  const counts = {
    WANNA_WATCH: user.viewer?.wannaWatchCount,
    WATCHING: user.viewer?.watchingCount,
    WATCHED: user.viewer?.watchedCount,
    ON_HOLD: user.viewer?.onHoldCount,
    STOP_WATCHING: user.viewer?.stopWatchingCount,
  };
  return (
    <div className="grid gap-2 lg:gap-4 grid-cols-2">
      <Card url="/mypage/records" id="edit" type="form" label="記録数" value={user.viewer?.recordsCount} direction="col" />
      <div className="grid gap-2 lg:gap-4">
        {Const.STATUS_STATE_LIST.map((status) => (
          <Card
            key={status.id}
            url={libraryTabHref(status.id)}
            id={`${status.id}_CURRENT`}
            type="status_state"
            label={status.label}
            value={counts[status.id as keyof typeof counts]}
          />
        ))}
      </div>
    </div>
  );
}