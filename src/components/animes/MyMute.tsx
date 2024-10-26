'use client';

import { useState } from 'react';

import Icons from '~/components/icons/Icons';

import { getMutedUsers } from '~/libs/function';

export default function MyMute() {
  const [mutedUsers, setMutedUsers] = useState(getMutedUsers());

  const unMuteUser = (user: {
    annictId: number;
    username: string;
  }) => {
    let mutedUsers = getMutedUsers();
    const annictId = user.annictId;
    mutedUsers = mutedUsers.filter(user => user.annictId !== annictId);
    localStorage.setItem("mutedUsers", JSON.stringify(mutedUsers));
    setMutedUsers(mutedUsers);
  };

  return (
    <div className="mt-4">
      <p className="mx-4 text-sm">API では Annict のミュート設定が考慮されていないため、独自にローカルストレージを使ってユーザーのミュートを管理します。</p>
      <p className="mt-2 mx-4 text-xs pl-[1em] indent-[-1em]">※記録とみんなの評価から対象者を除外します。</p>
      <p className="mt-2 mx-4 text-xs pl-[1em] indent-[-1em]">※ミュートした時点のユーザーネームのため、変更があった場合はリンクが無効になることがありますが、除外判定は AnnictId で行っているので対象者がズレることはありません。</p>
      
      {mutedUsers.length === 0 ? (
        <p className="mt-4">ミュートしているユーザーはいません。</p>
      ) : (
        <ul className="mt-4 flex flex-col-reverse">
          {mutedUsers.map(user => {
            return (
              <li key={`mute-${user.username}`} className="flex items-center gap-4 py-2 px-4 hover:bg-black/10 hover:dark:bg-white/20">
                <a className="flex items-center hover:underline" href={`https://annict.com/@${user.username}`} target="_blank" rel="noopener noreferrer">
                  <Icons id="open_in_new" type="link" className="text-[1.5em] mr-1" />
                  @{user.username}
                </a>
                <button onClick={() => unMuteUser(user)} className="ml-auto text-sm hover:text-red-500" type="button">ミュートを解除する</button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  );
}