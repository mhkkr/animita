'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { Popover, PopoverPanel, PopoverButton } from '@headlessui/react';
import { useQuery } from '@apollo/client';
import { searchEpisodesGql } from '~/features/apollo/gql/query/searchEpisodesGql';
import { viewerUserGql } from '~/features/apollo/gql/query/viewerUserGql';
import type { SearchEpisodesQuery, ViewerUserQuery, Work, Episode, Record } from '~/features/apollo/generated-types';

import { useRecoilState, useSetRecoilState } from 'recoil';
import { recordDeleteIdAtom } from '~/atoms/recordDeleteIdAtom';
import { recordEditIdAtom } from '~/atoms/recordEditIdAtom';
import { recordCurrentEpisodeAnnictIdAtom } from '~/atoms/recordCurrentEpisodeAnnictIdAtom';
import { recordOpenerEpisodeAnnictIdAtom } from '~/atoms/recordOpenerEpisodeAnnictIdAtom';
import { recordShowNoCommentAtom } from '~/atoms/recordShowNoCommentAtom';
import { recordShowInfoCastAtom } from '~/atoms/recordShowInfoCastAtom';

import Icons from '~/components/icons/Icons';

import DisplayDate from '~/components/dates/DisplayDate';
import { RingSpinner } from '~/components/spinners/Spinner';

import Cast from '~/components/animes/AnimeCast';
import { InfoLite } from '~/components/animes/AnimeInfo';
import Delete from '~/components/animes/AnimeRecordDelete';
import Mute from '~/components/animes/AnimeRecordMute';
import Edit from '~/components/animes/AnimeRecordEdit';
import Favorite from '~/components/animes/AnimeRecordFavorite';
import Twitter from '~/components/animes/AnimeRecordTwitter';
import Form from '~/components/animes/AnimeRecordForm';

import Const from '~/constants';

export {
  ToggleButton,
  Viewer
}

function ToggleButton({ children, className, episodeAnnictId, workAnnictId, disabled }: {
  children?: React.ReactNode,
  className?: string,
  episodeAnnictId?: number | undefined,
  workAnnictId?: number | undefined,
  disabled?: boolean
}) {
  const setRecordEditId = useSetRecoilState(recordEditIdAtom);
  const setRecordCurrentEpisodeAnnictId = useSetRecoilState(recordCurrentEpisodeAnnictIdAtom);
  const setRecordOpenerEpisodeAnnictId = useSetRecoilState(recordOpenerEpisodeAnnictIdAtom);
  const router = useRouter();

  return (
    <button 
      onClick={() => {
        if (workAnnictId) {
          router.push(`/anime/${workAnnictId}`);
        }

        setRecordEditId('');

        if (!episodeAnnictId) {
          document.body.style.overflow = 'visible';
          setRecordOpenerEpisodeAnnictId(0);
        } else {
          document.body.style.overflow = 'hidden';
          setRecordCurrentEpisodeAnnictId(episodeAnnictId ?? 0);
          setRecordOpenerEpisodeAnnictId(episodeAnnictId ?? 0);
        }
      }}
      className={className}
      type="button"
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function generateDateStyle({ date }: { date: Date }) {
  if (!date) return 0;
  return date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + date.getMinutes();
}

const getMutedUsers = (): { annictId: number, username: string }[] => {
  const mutedUsers = localStorage.getItem("mutedUsers");
  return mutedUsers ? JSON.parse(mutedUsers) : [];
};

function Records({ records, episode, user }: { records: Record[], episode: Episode, user: ViewerUserQuery }) {
  const mutedUsers = getMutedUsers();
  const filteredRecords = records.filter(record => !mutedUsers.some(user => user.annictId === record.user.annictId));

  return (
    <ul className="flex flex-wrap text-sm">
      {filteredRecords.map(record => <Record key={record.annictId} record={record} episode={episode} user={user} />)}
    </ul>
  );
}

function Record({ record, episode, user }: { record: Record, episode: Episode, user: ViewerUserQuery }) {
  const [mute, setMute] = useState(false);

  const [recordShowNoComment] = useRecoilState(recordShowNoCommentAtom);
  const [recordDeleteId] = useRecoilState(recordDeleteIdAtom);
  const [recordEditId] = useRecoilState(recordEditIdAtom);
  
  const ratingstate = Const.RATINGSTATE_LIST.find(RATINGSTATE => RATINGSTATE.id === record.ratingState);
  const isMyRecord = record.user.username === user.viewer?.username;
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
          ): (
            <figure className="flex items-center gap-3">
              <div className="flex-shrink-0 rounded-full overflow-hidden w-8 h-8">
                <img className="object-cover w-full h-full" src={record.user?.avatarUrl || ''} alt="" loading="lazy" />
              </div>
              <figcaption className="break-all">{record.user.name}</figcaption>
            </figure>
          )}
          <div className="flex-none ml-auto">
            <Popover className="relative">
              {({ close }) => (
                <>
                  <PopoverPanel
                    transition
                    className="absolute right-0 top-full mt-2 whitespace-nowrap flex flex-col gap-2 p-2 border dark:border-stone-700 bg-white dark:bg-black rounded-md overflow-hidden shadow-lg origin-top transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
                  >
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
                <div className={`inline-flex items-center px-2 py-0.5 rounded-full ${ratingstate?.bgColor} text-white dark:text-inherit`}>
                  <Icons id={ratingstate?.id} type="rating_state" className="text-sm mr-1" />
                  {ratingstate?.label}
                </div>
              }
              <div className="flex flex-wrap items-center gap-3">
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

function ViewerInInfoCast({ work }: { work: Work }) {
  const [recordShowInfoCast, setRecordShowInfoCast] = useRecoilState(recordShowInfoCastAtom);

  const handleClick = useCallback(() => setRecordShowInfoCast(prevState => !prevState), []);

  return (
    <div className="mb-4 border-t dark:border-stone-700">
      <div className="mt-4">
        <button
          onClick={handleClick}
          className="flex items-center mx-auto pr-2 pl-4 py-1 border dark:border-white/30 rounded-full"
          type="button"
        >
          <span>アニメ情報とキャストを{recordShowInfoCast ? '非表示にする' : '表示する'}</span>
          <Icons id={recordShowInfoCast ? 'arrow_drop_up' : 'arrow_drop_down'} type="navigation" className="text-[1.5em]" />
        </button>
      </div>
      {recordShowInfoCast && (
        <>
          <InfoLite work={work} />
          <div className="mt-6">
            <h2 className="px-4 pb-2 mb-2 font-bold border-b dark:border-stone-700">キャスト</h2>
            <Cast work={work} />
          </div>
        </>
      )}
    </div>
  )
}

function NoCommentRecords({ otherRecords, episode, user }: { otherRecords: Record[], episode: Episode, user: ViewerUserQuery }) {
  const [recordShowNoComment, setRecordShowNoComment] = useRecoilState(recordShowNoCommentAtom);

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
      <Records records={otherRecords} episode={episode} user={user} />
    </div>
  )
}

function RatingStates({ records }: { records: Record[] }) {
  let allCount = 0;
  const ratings = {
    'BAD' : 0,
    'AVERAGE' : 0,
    'GOOD' : 0,
    'GREAT' : 0
  };

  records.forEach(record => {
    if (record.ratingState) {
      ratings[record.ratingState]++;
      allCount++;
    }
  });

  if (allCount === 0) {
    return <></>;
  }

  const maxValue = Math.max(...Object.values(ratings));

  return (
    <div className="p-4 border-t dark:border-stone-700 text-sm">
      <p>★みんなの評価</p>
      <ul className="mt-2 flex text-center rounded-md overflow-hidden">
        {Object.entries(ratings).map(([key, value]) => {
          const ratingstate = Const.RATINGSTATE_LIST.find(RATINGSTATE => RATINGSTATE.id === key);
          return (
            value !== 0 && (
              <li key={key} className={`min-w-4 py-2 ${ratingstate?.bgColor} ${maxValue == value ? "font-bold" : ""}`} style={{ width: value / allCount * 100 + "%" }} title={ratingstate?.label}>
                {value}
              </li>
            )
          )
        })}
      </ul>
    </div>
  )
}

function ViewerBody({ work, episode, user }: { work: Work, episode: Episode, user: ViewerUserQuery }) {
  const records = episode.records?.nodes ? Array.from(episode.records?.nodes) as Record[] : [];

  const mainRecords = records.filter(record => record?.comment || record?.user.username === user?.viewer?.username);
  const otherRecords = records.filter(record => !record?.comment && record?.user.username !== user?.viewer?.username);

  return (
    <>
      <div className="p-4">
        <div className="mb-3 flex gap-2">
          <span className="flex-shrink-0">{episode.numberText}</span>
          <span className="flex-1">{episode.title || '未定'}</span>
          <ToggleButton className="flex-shrink-0 flex items-start">
            <Icons id="close" type="navigation" className="text-2xl" />
          </ToggleButton>
        </div>
        {episode && <Form episode={episode} />}
      </div>
      <ViewerInInfoCast work={work} />
      <div className="grid grid-cols-2 border-t dark:border-stone-700 text-xs text-center">
        <span className="p-4">全評価数：<span className="inline-block">{episode.recordsCount}</span></span>
        <span className="p-4 border-l dark:border-stone-700">コメントあり：<span className="inline-block">{records.filter(record => record?.comment).length}</span></span>
      </div>
      <RatingStates records={records} />
      <Records records={mainRecords} episode={episode} user={user} />
      <NoCommentRecords otherRecords={otherRecords} episode={episode} user={user} />
    </>
  );
}

function Viewer({ work }: { work: Work }) {
  const [recordOpenerEpisodeAnnictId, setRecordOpenerEpisodeAnnictId] = useRecoilState(recordOpenerEpisodeAnnictIdAtom);
  const [recordCurrentEpisodeAnnictId] = useRecoilState(recordCurrentEpisodeAnnictIdAtom);

  const { data: user, loading: ul, error: ue } = useQuery<ViewerUserQuery>(viewerUserGql);
  const { data: episodes, loading: el, error: ee } = useQuery<SearchEpisodesQuery>(searchEpisodesGql, {
    variables: { annictIds: [recordCurrentEpisodeAnnictId] }
  });
  const episode = episodes?.searchEpisodes?.nodes ? (episodes?.searchEpisodes?.nodes[0] as Episode) : null;

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'visible';
      setRecordOpenerEpisodeAnnictId(0);
    };
  }, []);

  return (
    <div className={`
      fixed inset-0 z-40 bg-slate-700/70 overflow-y-auto
      ${recordOpenerEpisodeAnnictId === 0 ? 'hidden' : 'block'}
    `}>
      <div className={`relative sm:py-24 sm:px-4 ${el && 'py-24 px-4'}`}>
        <ToggleButton className="absolute inset-0" />

        <div className={`relative mx-auto bg-white dark:bg-black overflow-hidden sm:max-w-xl sm:rounded-lg sm:shadow-2xl ${el ? 'max-w-xl rounded-lg shadow-2xl' : ''}`}>
          {(el || ul) && <div className="p-8 text-center text-5xl text-annict-100"><RingSpinner /></div>}
          {(ee || ue) && <p className="p-4 text-red-500">{ee?.message || ue?.message}</p>}

          {!(el || ee || ul || ue) && <>
            {episode && user ?
              <ViewerBody work={work} episode={episode} user={user} /> :
              <div className="p-6 dark:text-white/70">
                <Icons id="unknow" type="notification" className="table mx-auto mb-4 text-2xl" />
                <p className="text-center">エピソードがありません！</p>
              </div>
            }
          </>}
        </div>
      </div>
    </div>
  );
}