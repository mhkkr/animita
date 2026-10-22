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
        <p className="mt-2 text-sm">API では Annict のミュートに影響を受けずにデータを取得するため、このアプリ内のローカルストレージでユーザーのミュートを管理します。</p>
        <p className="mt-2 text-xs pl-[1em] indent-[-1em]">※エピソードまたは記録の一覧とみんなの評価から対象者を除外します。</p>
        <p className="mt-2 text-xs pl-[1em] indent-[-1em]">※下記リストはミュートした時点のユーザーネームのため、変更された場合はリンクが無効になります。除外判定は AnnictId で行っているので、ミュートの対象者がズレることはありません。</p>
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
                @{user.username}
              </a>
              <button onClick={() => unMuteUser(user)} className="ml-auto whitespace-nowrap text-sm hover:text-red-500" type="button">ミュートを解除する</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
