"use client";

import { useEffect, useState } from "react";

import Icons from "~/components/icons/Icons";

import { getMutedUsers } from "~/libs/function";
import { setLocalStorageItem } from "~/libs/storage";

import Const from "~/constants";

export default function MyMute() {
  const [mutedUsers, setMutedUsers] = useState<{ annictId: number, username: string }[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setMutedUsers(getMutedUsers());
    setReady(true);
  }, []);

  const unMuteUser = (user: {
    annictId: number;
    username: string;
  }) => {
    let next = getMutedUsers();
    const annictId = user.annictId;
    next = next.filter((item) => item.annictId !== annictId);
    setLocalStorageItem(Const.STORAGE_MUTED_USERS, JSON.stringify(next));
    setMutedUsers(next);
  };

  return (
    <section>
      <header className="px-4">
        <h1 className="text-lg font-bold">ミュート</h1>
        <p className="mt-1 text-sm">API によるデータ取得では Annict のミュートが評価されないため、このアプリ独自のミュート機能を提供します。</p>
        <p className="mt-1 pl-[1em] indent-[-1em] text-xs dark:text-white/70">※ユーザーネームが変更された場合は下記のリンクが無効になりますが、ミュート判定は AnnictId で行っており、ミュート対象者が変わることはありません。</p>
      </header>

      {!ready || mutedUsers.length === 0 ? (
        <p className="mt-4 px-4">
          {!ready ? "読み込み中…" : "ミュートしているユーザーはいません。"}
        </p>
      ) : (
        <ul className="mt-4 flex flex-col-reverse">
          {mutedUsers.map((user) => (
            <li key={`mute-${user.username}`} className="flex items-center gap-4 py-2 px-4 hover:bg-black/10 hover:dark:bg-white/20">
              <a className="flex hover:underline break-all" href={`https://annict.com/@${user.username}`} target="_blank" rel="noopener noreferrer">
                <Icons id="open_in_new" type="link" className="flex-none relative top-0.5 text-[1.25em] mr-1" />
                <span className="relative -translate-y-px">@{user.username}</span>
              </a>
              <button onClick={() => unMuteUser(user)} className="ml-auto pb-px whitespace-nowrap text-sm hover:text-red-500" type="button">ミュートを解除する</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
