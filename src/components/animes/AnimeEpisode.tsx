'use client';

import { useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { useQuery } from '@apollo/client/react';
import { searchEpisodesGql } from '~/features/apollo/gql/query/searchEpisodesGql';
import { viewerUserGql } from '~/features/apollo/gql/query/viewerUserGql';
import type { SearchEpisodesQuery, ViewerUserQuery, Work, Episode, Record, LibraryEntriesQuery } from '~/features/apollo/generated-types';

import { useAtom, useSetAtom } from 'jotai';
import { recordEditIdAtom } from '~/atoms/recordEditIdAtom';
import { recordCurrentEpisodeAnnictIdAtom } from '~/atoms/recordCurrentEpisodeAnnictIdAtom';
import { recordOpenerEpisodeAnnictIdAtom } from '~/atoms/recordOpenerEpisodeAnnictIdAtom';
import { recordShowInfoCastAtom } from '~/atoms/recordShowInfoCastAtom';

import Icons from '~/components/icons/Icons';

import { RingSpinner } from '~/components/spinners/Spinner';

import { Link, Staff, Cast } from '~/components/animes/AnimeInfo';
import Form from '~/components/animes/AnimeRecordForm';
import Evaluation from '~/components/animes/AnimeEvaluation';
import Records from '~/components/animes/AnimeRecords';

import Const from '~/constants';

function InfoCast({ work }: { work: Work }) {
  const [visible, setVisible] = useAtom(recordShowInfoCastAtom);

  const handleClick = useCallback(() => setVisible(prevState => !prevState), []);

  return (
    <div className="mb-4 border-t dark:border-stone-700">
      <div className="mt-4">
        <button
          onClick={handleClick}
          className="flex items-center my-5 mx-auto pr-2 pl-4 py-1 border dark:border-white/30 rounded-full"
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

// エピソードが視聴可能かの判定と配信開始時刻を返却する
function episodeStatus(libraryEntries: LibraryEntriesQuery | undefined, work: Work, episodeIndex: number, now: number) {
  if (!libraryEntries) return { available: true, startedAt: '' };

  const entry = libraryEntries?.viewer?.libraryEntries?.nodes?.find(node => node?.work.annictId === work.annictId);

  const channelSomePrograms = work.programs?.nodes?.filter(program => program?.channel.annictId === entry?.nextProgram?.channel.annictId);
  if (!channelSomePrograms) return { available: true, startedAt: '' };

  const program = channelSomePrograms[episodeIndex];
  if (!program) return { available: true, startedAt: '' };

  const startedAt = new Date(program?.startedAt);

  return {
    available: now > startedAt.getTime(),
    startedAt: startedAt
  };
}

function Contents({ work, episode, user, libraryEntries }: { work: Work, episode: Episode, user: ViewerUserQuery, libraryEntries?: LibraryEntriesQuery }) {
  const records = episode.records?.nodes ? Array.from(episode.records?.nodes) as Record[] : [];

  const mainRecords = records.filter(record => record?.comment || record?.user.username === user?.viewer?.username);
  const otherRecords = records.filter(record => !record?.comment && record?.user.username !== user?.viewer?.username);

  // 前後のエピソードを取得
  const allEpisodes = (work.episodes?.nodes ? Array.from(work.episodes.nodes) : []) as Episode[];
  const sortedEpisodes = [...allEpisodes].sort((a, b) => (a?.sortNumber as number || 0) - (b?.sortNumber as number || 0));
  const currentIndex = sortedEpisodes.findIndex(ep => ep?.annictId === episode.annictId);
  const prevEpisode = currentIndex > 0 ? sortedEpisodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex < sortedEpisodes.length - 1 ? sortedEpisodes[currentIndex + 1] : null;

  // 前後のエピソードが視聴可能か判定
  const now = Date.now();
  const prevEpisodeIndex = prevEpisode ? currentIndex - 1 : -1;
  const nextEpisodeIndex = nextEpisode ? currentIndex + 1 : -1;
  const prevStatus = prevEpisodeIndex >= 0 ? episodeStatus(libraryEntries, work, prevEpisodeIndex, now) : null;
  const nextStatus = nextEpisodeIndex >= 0 ? episodeStatus(libraryEntries, work, nextEpisodeIndex, now) : null;

  return (
    <>
      <div className="p-4">
        <div className="mb-3 flex gap-2 items-center">
          <span className="flex-shrink-0">{episode.numberText}</span>
          <span className="flex-1">{episode.title || Const.EPISODE_TITLE_UNDEFINED}</span>
          {prevEpisode ? (
              <ToggleButton
                className={`flex-shrink-0 px-2 py-1 border dark:border-white/30 rounded text-sm ${!prevStatus?.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                episodeAnnictId={prevStatus?.available ? prevEpisode.annictId : undefined}
                workAnnictId={prevStatus?.available ? work.annictId : undefined}
                disabled={!prevStatus?.available}
              >前</ToggleButton>
            ) : null}
            {nextEpisode ? (
              <ToggleButton
                className={`flex-shrink-0 px-2 py-1 border dark:border-white/30 rounded text-sm ${!nextStatus?.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                episodeAnnictId={nextStatus?.available ? nextEpisode.annictId : undefined}
                workAnnictId={nextStatus?.available ? work.annictId : undefined}
                disabled={!nextStatus?.available}
              >次</ToggleButton>
            ) : null}
          <ToggleButton className="flex-shrink-0" workAnnictId={work.annictId}>
            <Icons id="close" type="navigation" className="text-2xl" />
          </ToggleButton>
        </div>
        {episode && <Form episode={episode} />}
      </div>
      <InfoCast work={work} />
      <Evaluation records={records} episode={episode} user={user} />
      <Records records={mainRecords} otherRecords={otherRecords} episode={episode} user={user} />
    </>
  );
}

// URLからepisodeIdパラメータを削除する
function removeEpisodeIdFromUrl(workAnnictId?: number, pathname?: string | null) {
  if (workAnnictId) {
    const newUrl = `/anime/${workAnnictId}`;
    window.history.replaceState({}, '', newUrl);
  } else if (pathname) {
    const url = new URL(window.location.href);
    url.searchParams.delete('episodeId');
    window.history.replaceState({}, '', url.pathname + url.search);
  }
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
  const pathname = usePathname();

  const closeForm = () => {
    setRecordEditId('');
    setRecordOpenerEpisodeAnnictId(0);
    document.body.style.overflow = 'visible';
    // URLからepisodeIdを削除（window.history.replaceStateで直接更新してsearchParamsの更新を避ける）
    removeEpisodeIdFromUrl(workAnnictId, pathname);
  };

  const openForm = () => {
    if (!episodeAnnictId) return;
    setRecordEditId('');
    document.body.style.overflow = 'hidden';
    setRecordCurrentEpisodeAnnictId(episodeAnnictId);
    setRecordOpenerEpisodeAnnictId(episodeAnnictId);
  };

  const formOpen = () => {
    if (!episodeAnnictId) {
      closeForm();
    } else {
      openForm();
    }
  };

  return (
    <button 
      onClick={() => {
        if (disabled) return;
        if (workAnnictId && episodeAnnictId) {
          router.push(`/anime/${workAnnictId}?episodeId=${episodeAnnictId}`);
        } else {
          formOpen();
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

// エピソード記録
export function Episode({ work, libraryEntries }: { work: Work, libraryEntries?: LibraryEntriesQuery }) {
  const [recordOpenerEpisodeAnnictId, setRecordOpenerEpisodeAnnictId] = useAtom(recordOpenerEpisodeAnnictIdAtom);
  const [recordCurrentEpisodeAnnictId] = useAtom(recordCurrentEpisodeAnnictIdAtom);

  const { data: user, loading: ul, error: ue } = useQuery<ViewerUserQuery>(viewerUserGql);
  const { data: episodes, loading: el, error: ee } = useQuery<SearchEpisodesQuery>(searchEpisodesGql, {
    variables: { annictIds: [recordCurrentEpisodeAnnictId] },
    notifyOnNetworkStatusChange: false
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
      <div className={`min-h-svh relative sm:py-24 sm:px-4 ${el ? 'py-24 px-4' : ''}`}>
        {/* 背景クリックで閉じる用 */}
        <ToggleButton className="absolute inset-0" workAnnictId={work.annictId} />

        <div className={`relative mx-auto bg-white dark:bg-black overflow-hidden sm:max-w-xl sm:rounded-lg sm:shadow-2xl ${el ? 'max-w-xl rounded-lg shadow-2xl' : ''}`}>
          {(el || ul) && <div className="p-8 text-center text-5xl text-annict-100"><RingSpinner /></div>}
          {(ee || ue) && <p className="p-4 text-red-500">{ee?.message || ue?.message}</p>}

          {!(el || ee || ul || ue) && <>
            {episode && user ? (
              <Contents work={work} episode={episode} user={user} libraryEntries={libraryEntries} />
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