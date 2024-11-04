'use client';

import { useState, useCallback } from 'react';

import { Popover, PopoverPanel, PopoverButton } from '@headlessui/react';
import type { ViewerUserQuery, Episode, Record } from '~/features/apollo/generated-types';

import { useAtom } from 'jotai';
import { recordDeleteIdAtom } from '~/atoms/recordDeleteIdAtom';
import { recordEditIdAtom } from '~/atoms/recordEditIdAtom';
import { recordShowNoCommentAtom } from '~/atoms/recordShowNoCommentAtom';

import Icons from '~/components/icons/Icons';

import DisplayDate from '~/components/dates/DisplayDate';

import Delete from '~/components/animes/AnimeRecordDelete';
import Mute from '~/components/animes/AnimeRecordMute';
import Edit from '~/components/animes/AnimeRecordEdit';
import Favorite from '~/components/animes/AnimeRecordFavorite';
import Twitter from '~/components/animes/AnimeRecordTwitter';

import { generateDateStyle, getMutedUsers } from '~/libs/function';
import { getSetting } from '~/libs/settings';

import Const from '~/constants';

export default function WrapperRecords({ records, otherRecords, episode, user }: { records: Record[], otherRecords: Record[], episode: Episode, user: ViewerUserQuery }) {
  const peoplesRecords = getSetting("displays", "peoples-records");

  if (peoplesRecords === "invisible") {
    return <></>;
  } else if (peoplesRecords === "record-after-visible") {
    const isMyRecord = records.find(record => record.user.annictId === user.viewer?.annictId);
    if (!isMyRecord) {
      return <></>;
    }
  }

  return (
    <>
      <Records records={records} episode={episode} user={user} />
      <NoCommentRecords records={otherRecords} episode={episode} user={user} />
    </>
  );
}

function NoCommentRecords({ records, episode, user }: { records: Record[], episode: Episode, user: ViewerUserQuery }) {
  const [recordShowNoComment, setRecordShowNoComment] = useAtom(recordShowNoCommentAtom);

  const handleClick = useCallback(() => setRecordShowNoComment(prevState => !prevState), []);

  return (
    <div className="border-t dark:border-stone-700">
      <div className="my-6">
        <button
          onClick={handleClick}
          className="flex items-center mx-auto pr-2 pl-4 py-1 border dark:border-white/30 rounded-full"
          type="button"
        >
          <span>コメントなしを{recordShowNoComment ? '非表示にする' : '表示する'}</span>
          <Icons id={recordShowNoComment ? 'arrow_drop_up' : 'arrow_drop_down'} type="navigation" className="text-[1.5em]" />
        </button>
      </div>
      <Records records={records} episode={episode} user={user} />
    </div>
  )
}

function Records({ records, episode, user }: { records: Record[], episode: Episode, user: ViewerUserQuery }) {
  const mutedUsers = getMutedUsers();
  const filteredRecords = records.filter(record => !mutedUsers.some(user => user.annictId === record.user.annictId));

  const ratingPriority = {
    GREAT: 4,
    GOOD: 3,
    AVERAGE: 2,
    BAD: 1,
  };

  return (
    <ul className="flex flex-wrap text-sm">
      {filteredRecords
        .sort((a, b) => {
          const ratingComparison = (b?.ratingState ? ratingPriority[b.ratingState] : 0) - (a?.ratingState ? ratingPriority[a.ratingState] : 0)

          if (ratingComparison === 0) {
            return b.likesCount - a.likesCount;
          }
          
          return ratingComparison;
        })
        .map(record => <Record key={record.annictId} record={record} episode={episode} user={user} />)
      }
    </ul>
  );
}

function Record({ record, episode, user }: { record: Record, episode: Episode, user: ViewerUserQuery }) {
  const [mute, setMute] = useState(false);

  const [recordShowNoComment] = useAtom(recordShowNoCommentAtom);
  const [recordDeleteId] = useAtom(recordDeleteIdAtom);
  const [recordEditId] = useAtom(recordEditIdAtom);
  
  const ratingState = Const.RATING_STATE_LIST.find(RATINGSTATE => RATINGSTATE.id === record.ratingState);
  const isMyRecord = record.user.annictId === user.viewer?.annictId;
  const disabled = recordDeleteId === record.id || recordEditId === record.id;

  return (
    <li
      className={`
        p-4 border-t dark:border-stone-700
        ${isMyRecord && 'order-first'}
        ${(record.comment || isMyRecord) ? 'w-full' : 'w-1/2 sm:w-1/3'}
        ${(!record.comment && !recordShowNoComment && !isMyRecord) && 'hidden'}
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
              <div className="flex-shrink-0 rounded-full overflow-hidden [contain:content] w-8 h-8">
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
                    className="absolute right-0 top-full mt-2 whitespace-nowrap flex flex-col py-0.5 border dark:border-stone-700 bg-white dark:bg-black rounded-md overflow-hidden [contain:content] shadow-lg origin-top transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
                  >
                    <a className="flex items-center px-2 py-1.5 hover:underline" href={`https://annict.com/@${record.user?.username}`} target="_blank" rel="noopener noreferrer" title="Annict のユーザーページへ">
                      <Icons id="open_in_new" type="link" className="mr-1" />
                      Annict
                    </a>
                    {isMyRecord ? (
                      <>
                        <Edit record={record} close={close} />
                        <Delete record={record} close={close} />
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
                {/* TODO: リンク付ける */}
                {/* <a className="hover:underline" href={`https://annict.com/@${record.user?.username}/records/${record.annictId}`} target="_blank" rel="noopener noreferrer" title="Annict のユーザーのエピソード記録ページへ"><DisplayDate date={record.createdAt} /></a> */}
                <span><DisplayDate date={record.createdAt} /></span>
                {generateDateStyle(record.createdAt) !== generateDateStyle(record.updatedAt) && <span className="dark:text-white/70 text-xs"><DisplayDate date={record.updatedAt} /></span>}
              </div>
            </div>
            {record.comment && <p className="mt-3 whitespace-pre-wrap">{record.comment}</p>}
          </>
        )}
      </div>
    </li>
  );
}