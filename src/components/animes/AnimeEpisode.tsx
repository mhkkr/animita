'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { useQuery } from '@apollo/client';
import { searchEpisodesGql } from '~/features/apollo/gql/query/searchEpisodesGql';
import { viewerUserGql } from '~/features/apollo/gql/query/viewerUserGql';
import type { SearchEpisodesQuery, ViewerUserQuery, Work, Episode, Record } from '~/features/apollo/generated-types';

import { useRecoilState, useSetRecoilState } from 'recoil';
import { muteUpdateAtom } from '~/atoms/muteUpdateAtom';
import { recordEditIdAtom } from '~/atoms/recordEditIdAtom';
import { recordCurrentEpisodeAnnictIdAtom } from '~/atoms/recordCurrentEpisodeAnnictIdAtom';
import { recordOpenerEpisodeAnnictIdAtom } from '~/atoms/recordOpenerEpisodeAnnictIdAtom';
import { recordShowInfoCastAtom } from '~/atoms/recordShowInfoCastAtom';

import Icons from '~/components/icons/Icons';

import { RingSpinner } from '~/components/spinners/Spinner';

import { NoCommentRecords, Records } from '~/components/animes/AnimeRecords';
import { Link, Staff, Cast } from '~/components/animes/AnimeInfo';
import Form from '~/components/animes/AnimeRecordForm';

import { getMutedUsers } from '~/libs/function';

import Const from '~/constants';

function InfoCast({ work }: { work: Work }) {
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
          <Link work={work} />
          <div className="px-4 mt-4">
            <Staff work={work} />
          </div>
          <div className="mt-6">
            <h2 className="px-4 pb-2 mb-2 font-bold border-b dark:border-stone-700">キャスト</h2>
            <Cast work={work} />
          </div>
        </>
      )}
    </div>
  )
}

function RatingStates({ records }: { records: Record[] }) {
  const [muteUpdate, setMuteUpdate] = useRecoilState(muteUpdateAtom);
  const mutedUsers = getMutedUsers();
  const [filteredRecords, setFilteredRecords] = useState<Record[]>(records.filter(record => !mutedUsers.some(user => user.annictId === record.user.annictId)));

  useEffect(() => {
    const mutedUsers = getMutedUsers();
    setFilteredRecords(records.filter(record => !mutedUsers.some(user => user.annictId === record.user.annictId)));
  }, [muteUpdate]);

  let allCount = 0;
  const ratings = {
    'BAD' : 0,
    'AVERAGE' : 0,
    'GOOD' : 0,
    'GREAT' : 0
  };

  filteredRecords.forEach(record => {
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
      <ul className="mt-2 flex text-center rounded-md overflow-hidden [contain:content]">
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

function Contents({ work, episode, user }: { work: Work, episode: Episode, user: ViewerUserQuery }) {
  const records = episode.records?.nodes ? Array.from(episode.records?.nodes) as Record[] : [];

  const mainRecords = records.filter(record => record?.comment || record?.user.username === user?.viewer?.username);
  const otherRecords = records.filter(record => !record?.comment && record?.user.username !== user?.viewer?.username);

  return (
    <>
      <div className="p-4">
        <div className="mb-3 flex gap-2">
          <span className="flex-shrink-0">{episode.numberText}</span>
          <span className="flex-1">{episode.title || Const.EPISODE_TITLE_UNDEFINED}</span>
          <ToggleButton className="flex-shrink-0 flex items-start">
            <Icons id="close" type="navigation" className="text-2xl" />
          </ToggleButton>
        </div>
        {episode && <Form episode={episode} />}
      </div>
      <InfoCast work={work} />
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

export function ToggleButton({ children, className, episodeAnnictId, workAnnictId, disabled }: {
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

export function Episode({ work }: { work: Work }) {
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
        {/* 背景クリックで閉じる用 */}
        <ToggleButton className="absolute inset-0" />

        <div className={`relative mx-auto bg-white dark:bg-black overflow-hidden [contain:content] sm:max-w-xl sm:rounded-lg sm:shadow-2xl ${el ? 'max-w-xl rounded-lg shadow-2xl' : ''}`}>
          {(el || ul) && <div className="p-8 text-center text-5xl text-annict-100"><RingSpinner /></div>}
          {(ee || ue) && <p className="p-4 text-red-500">{ee?.message || ue?.message}</p>}

          {!(el || ee || ul || ue) && <>
            {episode && user ? (
              <Contents work={work} episode={episode} user={user} />
            ) : (
              <div className="p-6 dark:text-white/70">
                <Icons id="unknow" type="notification" className="table mx-auto mb-4 text-2xl" />
                <p className="text-center">エピソードがありません！</p>
              </div>
            )}
          </>}
        </div>
      </div>
    </div>
  );
}