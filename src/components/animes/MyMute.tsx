'use client';

import { useState } from 'react';

import Icons from '~/components/icons/Icons';

const getMutedUsers = (): { annictId: number, username: string }[] => {
  const mutedUsers = localStorage.getItem("mutedUsers");
  return mutedUsers ? JSON.parse(mutedUsers) : [];
};

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
      <p className="mx-4 text-sm">API では Annict のミュートが考慮されていないため、ローカルストレージにてユーザーのミュートを管理します。</p>
      <p className="mt-2 mx-4 text-xs pl-[1em] indent-[-1em]">※ミュートした時点での UserName なので、変更があった場合はリンクが無効の場合があります。</p>
      <p className="mt-1 mx-4 text-xs pl-[1em] indent-[-1em]">※ミュート自体は AnnictId で行っているので対象者がズレることはありません。</p>
      
      {mutedUsers.length === 0 ? (
        <p className="mt-4">ミュートしているユーザーはいません。</p>
      ) : (
        <ul className="mt-4">
          {mutedUsers.map(user => {
            return (
              <li key={`mute-${user.username}`} className="flex items-center gap-4 py-2 px-4 hover:bg-black/10 hover:dark:bg-white/20">
                <a className="flex items-center" href={`https://annict.com/@${user.username}`} target="_blank" rel="noopener noreferrer">
                  <Icons id="open_in_new" type="link" className="text-[1.5em] mr-1" />
                  @{user.username}
                </a>
                <button onClick={() => unMuteUser(user)} className="ml-auto text-sm" type="button">ミュートを解除する</button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  );
}