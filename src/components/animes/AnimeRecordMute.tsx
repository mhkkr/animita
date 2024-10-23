import type { Dispatch, SetStateAction } from 'react';

import { Record, User } from '~/features/apollo/generated-types';

import Icons from '~/components/icons/Icons';

const getMutedUsers = (): { annictId: number, username: string }[] => {
  const mutedUsers = localStorage.getItem("mutedUsers");
  return mutedUsers ? JSON.parse(mutedUsers) : [];
};

export default function Mute({ record, mute, setMute, close }: { record: Record, mute: boolean, setMute: Dispatch<SetStateAction<boolean>>, close: () => void }) {
  const muteUser = (user: User) => {
    const mutedUsers = getMutedUsers();
    const annictId = user.annictId;
    const username = user.username;
    if (!mutedUsers.some(user => user.annictId === annictId)) {
      mutedUsers.push({ annictId, username });
      localStorage.setItem('mutedUsers', JSON.stringify(mutedUsers));
      setMute(true);
    }
    close();
  };

  const unMuteUser = (user: User) => {
    let mutedUsers = getMutedUsers();
    const annictId = user.annictId;
    mutedUsers = mutedUsers.filter(user => user.annictId !== annictId);
    localStorage.setItem("mutedUsers", JSON.stringify(mutedUsers));
    setMute(false);
    close();
  };

  return (
    <button
      onClick={() => mute ? unMuteUser(record.user) : muteUser(record.user)}
      className="inline-flex items-center"
      type="button"
    >
      {mute ? (
        <>
          <Icons id="volume_up" type="form" className="mr-1" />
          ミュートを解除
        </>
      ): (
        <>
          <Icons id="volume_off" type="form" className="mr-1" />
          ミュートにする
        </>
      )}
    </button>
  );
}