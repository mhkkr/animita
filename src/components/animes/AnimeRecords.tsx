'use client';

import { useState } from 'react';

import { Popover, PopoverPanel, PopoverButton } from '@headlessui/react';
import type { ViewerUserQuery, Episode, Record } from '~/features/apollo/generated-types';

import { useAtom } from 'jotai';
import { recordDeleteIdAtom } from '~/atoms/recordDeleteIdAtom';
import { recordEditIdAtom } from '~/atoms/recordEditIdAtom';

import Icons from '~/components/icons/Icons';

import DisplayDate from '~/components/dates/DisplayDate';

import Delete from '~/components/animes/AnimeRecordDelete';
import Mute from '~/components/animes/AnimeRecordMute';
import Edit from '~/components/animes/AnimeRecordEdit';
import Favorite from '~/components/animes/AnimeRecordFavorite';
import Twitter from '~/components/animes/AnimeRecordTwitter';

import { wasEdited, getMutedUsers } from '~/libs/function';
import { compareByRating } from '~/libs/rating';
import { getSetting } from '~/libs/settings';

import Const from '~/constants';

export default function WrapperRecords({ records, episode, user }: { records: Record[], episode: Episode, user: ViewerUserQuery }) {
  const comments = getSetting("displays", "episode-comments");
  const mine = records.filter(record => record.user.annictId === user.viewer?.annictId);

  if (comments === "invisible") {
    if (mine.length === 0) {
      return <></>;
    }
    return <Records records={mine} episode={episode} user={user} />;
  }
  if (comments === "record-after-visible" && mine.length === 0) {
    return <></>;
  }

  return <Records records={records} episode={episode} user={user} />;
}

function Records({ records, episode, user }: { records: Record[], episode: Episode, user: ViewerUserQuery }) {
  const mutedUsers = getMutedUsers();
  const filteredRecords = records.filter(record => !mutedUsers.some(user => user.annictId === record.user.annictId));

  return (
    <ul className="flex flex-wrap text-sm">
      {filteredRecords
        .sort((a, b) => compareByRating(
          { state: a.ratingState, likesCount: a.likesCount },
          { state: b.ratingState, likesCount: b.likesCount },
        ))
        .map(record => <Record key={record.annictId} record={record} episode={episode} user={user} />)
      }
    </ul>
  );
}

function Record({ record, episode, user }: { record: Record, episode: Episode, user: ViewerUserQuery }) {
  const [mute, setMute] = useState(false);

  const [recordDeleteId] = useAtom(recordDeleteIdAtom);
  const [recordEditId] = useAtom(recordEditIdAtom);
  
  const ratingState = Const.RATING_STATE_LIST.find(RATINGSTATE => RATINGSTATE.id === record.ratingState);
  const isMyRecord = record.user.annictId === user.viewer?.annictId;
  const disabled = recordDeleteId === record.id || recordEditId === record.id;

  return (
    <li
      className={`
        p-4 border-t dark:border-stone-700 w-full
        ${isMyRecord && 'order-first'}
      `}
    >
      <div className={`
        transition-opacity
        ${disabled ? 'opacity-50' : ''}
      `}>
        <div className="flex items-center gap-3">
          {mute ? (
            <div className="flex items-center gap-3">
              このユーザーをミュートしました。
            </div>
          ) : (
            <figure className="flex items-center gap-2.5">
              <div className="shrink-0 rounded-full overflow-hidden w-8 h-8">
                <img className="object-cover w-full h-full" src={record.user?.avatarUrl || ''} alt="" loading="lazy" />
              </div>
              <figcaption className="line-clamp-2 break-all">{record.user.name}</figcaption>
            </figure>
          )}
          <div className="flex-none ml-auto">
            <Popover className="relative">
              {({ close }) => (
                <>
                  <PopoverPanel
                    transition
                    className="absolute right-0 top-full mt-2 whitespace-nowrap flex flex-col py-0.5 border dark:border-stone-500 bg-white dark:bg-black rounded-md overflow-hidden shadow-lg origin-top transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
                  >
                    <a className="flex items-center px-2 py-1.5 hover:underline" href={`https://annict.com/@${record.user?.username}`} target="_blank" rel="noopener noreferrer" title="Annict のユーザーページへ">
                      <Icons id="open_in_new" type="link" className="mr-1" />
                      Annict
                    </a>
                    {isMyRecord ? (
                      <>
                        <Edit record={record} close={close} />
                        <Delete record={record} episode={episode} viewerAnnictId={user.viewer?.annictId} close={close} />
                        <Twitter record={record} episode={episode} user={user} close={close} />
                      </>
                    ) : (
                      <Mute record={record} mute={mute} setMute={setMute} close={close} />
                    )}
                  </PopoverPanel>
                  <PopoverButton disabled={disabled ? true : false}>
                    <Icons id="more_horiz" type="navigation" />
                  </PopoverButton>
                </>
              )}
            </Popover>
          </div>
        </div>
        {!mute && (
          <>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Favorite record={record} />
              {record.ratingState &&
                <div className={`inline-flex items-center px-2 py-0.5 rounded-full ${ratingState?.bgColor} text-white dark:text-inherit`}>
                  <Icons id={ratingState?.id} type="rating_state" className="text-sm mr-1" />
                  {ratingState?.label}
                </div>
              }
              <div className="flex flex-wrap items-center gap-3">
                <span><DisplayDate date={record.createdAt} /></span>
                {wasEdited(record.createdAt, record.updatedAt) && <span className="dark:text-white/70 text-xs"><DisplayDate date={record.updatedAt} /></span>}
              </div>
            </div>
            {record.comment && <p className="mt-3 whitespace-pre-wrap">{record.comment}</p>}
          </>
        )}
      </div>
    </li>
  );
}