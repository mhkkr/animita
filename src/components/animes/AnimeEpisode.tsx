'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { useQuery } from '@apollo/client';
import { searchEpisodesGql } from '~/features/apollo/gql/query/searchEpisodesGql';
import { viewerUserGql } from '~/features/apollo/gql/query/viewerUserGql';
import type { SearchEpisodesQuery, ViewerUserQuery, Work, Episode, Record } from '~/features/apollo/generated-types';

import { useAtom, useSetAtom } from 'jotai';
import { recordEditIdAtom } from '~/atoms/recordEditIdAtom';
import { recordCurrentEpisodeAnnictIdAtom } from '~/atoms/recordCurrentEpisodeAnnictIdAtom';
import { recordOpenerEpisodeAnnictIdAtom } from '~/atoms/recordOpenerEpisodeAnnictIdAtom';
import { recordShowInfoCastAtom } from '~/atoms/recordShowInfoCastAtom';

import Icons from '~/components/icons/Icons';

import { RingSpinner } from '~/components/spinners/Spinner';

import { NoCommentRecords, Records } from '~/components/animes/AnimeRecords';
import { Link, Staff, Cast } from '~/components/animes/AnimeInfo';
import Form from '~/components/animes/AnimeRecordForm';
import Evaluation from '~/components/animes/AnimeEvaluation';

import Const from '~/constants';

function InfoCast({ work }: { work: Work }) {
  const [visible, setVisible] = useAtom(recordShowInfoCastAtom);

  const handleClick = useCallback(() => setVisible(prevState => !prevState), []);

  return (
    <div className="mb-4 border-t dark:border-stone-700">
      <div className="mt-4">
        <button
          onClick={handleClick}
          className="flex items-center mx-auto pr-2 pl-4 py-1 border dark:border-white/30 rounded-full"
          type="button"
        >
          <span>アニメ情報とキャストを{visible ? '非表示にする' : '表示する'}</span>
          <Icons id={visible ? 'arrow_drop_up' : 'arrow_drop_down'} type="navigation" className="text-[1.5em]" />
        </button>
      </div>
      {visible && (
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
      <Evaluation records={records} episode={episode} user={user} />
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
  const setRecordEditId = useSetAtom(recordEditIdAtom);
  const setRecordCurrentEpisodeAnnictId = useSetAtom(recordCurrentEpisodeAnnictIdAtom);
  const setRecordOpenerEpisodeAnnictId = useSetAtom(recordOpenerEpisodeAnnictIdAtom);
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
  const [recordOpenerEpisodeAnnictId, setRecordOpenerEpisodeAnnictId] = useAtom(recordOpenerEpisodeAnnictIdAtom);
  const [recordCurrentEpisodeAnnictId] = useAtom(recordCurrentEpisodeAnnictIdAtom);

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