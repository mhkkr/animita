'use client';

import { useQuery } from '@apollo/client';
import { viewerUserGql } from '~/features/apollo/gql/query/viewerUserGql';
import type { ViewerUserQuery } from '~/features/apollo/generated-types';

import DisplayDate from '~/components/dates/DisplayDate';

import Icons from '~/components/icons/Icons';

import { RingSpinner } from '~/components/spinners/Spinner';

export default function MyProfile() {
  const { data: user, loading: ul, error: ue } = useQuery<ViewerUserQuery>(viewerUserGql);

  if (ul) return <div className="p-8 text-center text-5xl text-annict-100"><RingSpinner /></div>;
  if (ue) return <p className="p-8 text-red-500">{ue?.message}</p>;

  if (user) {
    return (
      <div className="grid gap-4 p-4">
        <User user={user} />
        <Profile user={user} />
        <Communication user={user} />
        <Records user={user} />
      </div>
    );
  }
}

function User({ user }: { user: ViewerUserQuery }) {
  return (
    <figure className="flex items-center gap-3">
      <div className="flex-shrink-0 rounded-full overflow-hidden [contain:content] w-16 h-16">
        <img className="object-cover w-full h-full" src={user.viewer?.avatarUrl || ''} alt="" loading="lazy" />
      </div>
      <div className="flex-1 flex flex-col lg:flex-row lg:items-center gap-3">
        <figcaption className="flex-1 break-all">
          <p className="text-lg leading-tight">{user.viewer?.name}</p>
          <p className="text-sm opacity-70">@{user.viewer?.username}</p>
        </figcaption>
        <p className="flex-shrink-0 lg:ml-auto">
          <a className="inline-flex items-center gap-1 border rounded-full py-1.5 px-3 text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black" href={`https://annict.com/@${user.viewer?.username}`} target="_blank" rel="noopener noreferrer" title="Annict のユーザーページへ">
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
            <Icons id="open_in_new" type="link" className="flex-shrink-0 relative top-0.5 text-[1.25em]" />
            {user.viewer?.url}
          </a>
        </p>
      )}
      <p className="flex">
        <span className="flex-shrink-0">サービス開始日時：</span>
        <span className="flex flex-wrap gap-x-2">
          <span><DisplayDate date={user.viewer?.createdAt} /></span>
          <span>{Math.abs(Math.floor((new Date(user.viewer?.createdAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}日目</span>
        </span>
      </p>
    </div>
  );
}

function Card({ url, id, type, label, value }: { url: string, id: string, type: string, label: string, value: number | null | undefined }) {
  return (
    <a
      className="flex flex-col gap-2 p-3 border dark:border-stone-700 rounded-md hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <h2 className="flex gap-1 text-sm lg:text-base">
        <Icons id={id} type={type} className="flex-shrink-0 relative -top-[.05em]" />
        <span className="leading-trim">{label}</span>
      </h2>
      <div className="flex-grow flex items-center justify-center">
        <p className="leading-trim text-xl lg:text-3xl font-bold">
          {value ?? 0}
        </p>
      </div>
    </a>
  );
}

function Communication({ user }: { user: ViewerUserQuery }) {
  return (
    <div className="grid gap-4 grid-cols-3">
      <Card url="https://annict.com/notifications" id="bell" type="notification" label="通知" value={user.viewer?.notificationsCount} />
      <Card url={`https://annict.com/@${user.viewer?.username}/following`} id="reguser" type="notification" label="フォロイー" value={user.viewer?.followingsCount} />
      <Card url={`https://annict.com/@${user.viewer?.username}/followers`} id="user" type="notification" label="フォロワー" value={user.viewer?.followersCount} />
    </div>
  );
}

function Records({ user }: { user: ViewerUserQuery }) {
  return (
    <div className="grid gap-4 grid-cols-2">
      <Card url={`https://annict.com/@${user.viewer?.username}/records`} id="edit" type="form" label="記録数" value={user.viewer?.recordsCount} />
      <div className="grid gap-4">
        <Card url={`https://annict.com/@${user.viewer?.username}/watching`} id="WATCHING_CURRENT" type="status_state" label="見たい" value={user.viewer?.wannaWatchCount} />
        <Card url={`https://annict.com/@${user.viewer?.username}/wanna_watch`} id="WANNA_WATCH_CURRENT" type="status_state" label="見てる" value={user.viewer?.watchingCount} />
        <Card url={`https://annict.com/@${user.viewer?.username}/watched`} id="WATCHED_CURRENT" type="status_state" label="見た" value={user.viewer?.watchedCount} />
        <Card url={`https://annict.com/@${user.viewer?.username}/on_hold`} id="ON_HOLD_CURRENT" type="status_state" label="一時停止中" value={user.viewer?.onHoldCount} />
        <Card url={`https://annict.com/@${user.viewer?.username}/stop_watching`} id="STOP_WATCHING_CURRENT" type="status_state" label="視聴停止" value={user.viewer?.stopWatchingCount} />
      </div>
    </div>
  );
}