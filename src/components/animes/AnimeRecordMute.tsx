import type { Dispatch, SetStateAction } from 'react';
import { useAtom } from 'jotai';

import { Record, User } from '~/features/apollo/generated-types';

import { muteUpdateAtom } from '~/atoms/muteUpdateAtom';

import Icons from '~/components/icons/Icons';

import { getMutedUsers } from '~/libs/function';

import Const from '~/constants';

export default function Mute({ record, mute, setMute, close }: { record: Record, mute: boolean, setMute: Dispatch<SetStateAction<boolean>>, close: () => void }) {
  const [muteUpdate, setMuteUpdate] = useAtom(muteUpdateAtom);

  const addMuteUser = (user: User) => {
    const mutedUsers = getMutedUsers();
    const annictId = user.annictId;
    const username = user.username;
    if (!mutedUsers.some(user => user.annictId === annictId)) {
      mutedUsers.push({ annictId, username });
      localStorage.setItem(Const.STORAGE_MUTED_USERS, JSON.stringify(mutedUsers));
      setMute(true);
      setMuteUpdate(muteUpdate + 1);
    }
    close();
  };

  const unMuteUser = (user: User) => {
    let mutedUsers = getMutedUsers();
    const annictId = user.annictId;
    mutedUsers = mutedUsers.filter(user => user.annictId !== annictId);
    localStorage.setItem(Const.STORAGE_MUTED_USERS, JSON.stringify(mutedUsers));
    setMute(false);
    setMuteUpdate(muteUpdate - 1);
    close();
  };

  return (
    <button
      onClick={() => mute ? unMuteUser(record.user) : addMuteUser(record.user)}
      className="flex items-center px-2 py-1.5 hover:underline"
      type="button"
    >
      {mute ? (
        <>
          <Icons id="volume_up" type="form" className="mr-1" />
          ミュートを解除
        </>
      ) : (
        <>
          <Icons id="volume_off" type="form" className="mr-1" />
          ミュートにする
        </>
      )}
    </button>
  );
}