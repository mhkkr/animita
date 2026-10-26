'use client';

import { useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { recordEditIdAtom } from '~/atoms/recordEditIdAtom';
import { recordShowInfoCastAtom } from '~/atoms/recordShowInfoCastAtom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useQuery } from '@apollo/client/react';
import { searchEpisodesGql } from '~/features/apollo/gql/query/searchEpisodesGql';
import { viewerUserGql } from '~/features/apollo/gql/query/viewerUserGql';
import type { ViewerUserQuery, Work, Episode, Record } from '~/features/apollo/generated-types';
import type { LibraryEntriesData } from '~/types/libraryEntries';

import Icons from '~/components/icons/Icons';

import { RingSpinner } from '~/components/spinners/Spinner';

import { Link as InfoLink, Staff, Cast } from '~/components/animes/AnimeInfo';
import Form from '~/components/animes/AnimeRecordForm';
import Evaluation from '~/components/animes/AnimeEvaluation';
import Records from '~/components/animes/AnimeRecords';

import Const from '~/constants';
import { useEpisodeRatings, writeEpisodeRating } from '~/libs/episodeRatings';

function episodeRecordPath(workAnnictId: number, episodeAnnictId: number) {
  return `/anime/${workAnnictId}/episode/${episodeAnnictId}`;
}

export function RecordLink({
  workAnnictId,
  episodeAnnictId,
  className,
  children,
  scroll = true,
}: {
  workAnnictId: number;
  episodeAnnictId: number;
  className?: string;
  children: React.ReactNode;
  scroll?: boolean;
}) {
  return (
    <Link
      href={episodeRecordPath(workAnnictId, episodeAnnictId)}
      className={className}
      scroll={scroll}
    >
      {children}
    </Link>
  );
}

function InfoCast({ work }: { work: Work }) {
  const [visible, setVisible] = useAtom(recordShowInfoCastAtom);

  const handleClick = () => setVisible(prevState => !prevState);

  return (
    <div className="mb-4 border-t dark:border-stone-700">
      <div className="mt-4">
        <button
          onClick={handleClick}
          className="flex items-center my-5 mx-auto pr-2 pl-4 pt-1 pb-1.5 border dark:border-stone-500 rounded-full"
          type="button"
        >
          <span>アニメ情報とキャストを{visible ? '非表示にする' : '表示する'}</span>
          <Icons id={visible ? 'arrow_drop_up' : 'arrow_drop_down'} type="navigation" className="text-[1.5em]" />
        </button>
      </div>
      {visible && (
        <>
          <InfoLink work={work} />
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
function episodeStatus(libraryEntries: LibraryEntriesData, work: Work, episodeIndex: number, now: number) {
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

function EpisodeStepLink({
  children,
  className,
  episodeAnnictId,
  workAnnictId,
  disabled,
}: {
  children?: React.ReactNode;
  className?: string;
  episodeAnnictId?: number;
  workAnnictId: number;
  disabled?: boolean;
}) {
  if (disabled || episodeAnnictId == null) {
    return (
      <button className={className} type="button" disabled>
        {children}
      </button>
    );
  }

  return (
    <RecordLink
      className={className}
      workAnnictId={workAnnictId}
      episodeAnnictId={episodeAnnictId}
      scroll={false}
    >
      {children}
    </RecordLink>
  );
}

function Contents({
  work,
  episode,
  user,
  libraryEntries,
  onClose,
}: {
  work: Work;
  episode: Episode;
  user: ViewerUserQuery;
  libraryEntries?: LibraryEntriesData;
  onClose: () => void;
}) {
  const records = episode.records?.nodes ? Array.from(episode.records?.nodes) as Record[] : [];

  const viewerAnnictId = user.viewer?.annictId;
  const viewerRating = records.find(
    (record) => record.user.annictId === viewerAnnictId && record.ratingState,
  )?.ratingState;
  const alreadyRated = Boolean(viewerRating);
  const ratingColor = Const.RATING_STATE_LIST.find((state) => state.id === viewerRating)?.color;
  const [, setEpisodeRatings] = useEpisodeRatings();

  useEffect(() => {
    if (!viewerRating) return;
    setEpisodeRatings((current) => writeEpisodeRating(current, episode.annictId, viewerRating));
  }, [episode.annictId, viewerRating, setEpisodeRatings]);
  const mainRecords = records.filter(record => record?.comment || record?.user.username === user?.viewer?.username);

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
          <span className={`shrink-0 ${ratingColor ? `${ratingColor} font-bold` : ""}`}>{episode.numberText}</span>
          <span className={`flex-1 ${ratingColor ? `${ratingColor} font-bold` : ""}`}>{episode.title || Const.EPISODE_TITLE_UNDEFINED}</span>
            <EpisodeStepLink
              className={`shrink-0 px-2 py-1 border dark:border-stone-500 rounded text-sm ${!prevStatus?.available ? 'opacity-50 cursor-not-allowed' : ''}`}
              episodeAnnictId={prevStatus?.available ? prevEpisode?.annictId : undefined}
              workAnnictId={work.annictId}
              disabled={!prevStatus?.available}
            >前</EpisodeStepLink>
            <EpisodeStepLink
              className={`shrink-0 px-2 py-1 border dark:border-stone-500 rounded text-sm ${!nextStatus?.available ? 'opacity-50 cursor-not-allowed' : ''}`}
              episodeAnnictId={nextStatus?.available ? nextEpisode?.annictId : undefined}
              workAnnictId={work.annictId}
              disabled={!nextStatus?.available}
            >次</EpisodeStepLink>
          <button onClick={onClose} className="shrink-0" type="button">
            <Icons id="close" type="navigation" className="text-2xl" />
          </button>
        </div>
        {episode && <Form episode={episode} alreadyRated={alreadyRated} viewerAnnictId={viewerAnnictId} />}
      </div>
      <InfoCast work={work} />
      <Evaluation records={records} episode={episode} user={user} />
      <Records records={mainRecords} episode={episode} user={user} />
    </>
  );
}

export function RecordModal({
  annictId,
  episodeAnnictId,
  work,
  libraryEntries,
}: {
  annictId: number;
  episodeAnnictId: number;
  work: Work | null;
  libraryEntries?: LibraryEntriesData;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const setRecordEditId = useSetAtom(recordEditIdAtom);
  const active = pathname === episodeRecordPath(annictId, episodeAnnictId);

  const { data: user, loading: ul, error: ue } = useQuery(viewerUserGql, {
    skip: !active,
  });
  const { data: episodes, loading: el, error: ee } = useQuery(searchEpisodesGql, {
    variables: { annictIds: [episodeAnnictId] },
    skip: !active,
    notifyOnNetworkStatusChange: false,
  });
  const episode = episodes?.searchEpisodes?.nodes ? (episodes?.searchEpisodes?.nodes[0] as Episode) : null;

  useEffect(() => {
    if (!active) return;

    setRecordEditId('');
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
      setRecordEditId('');
    };
  }, [active, episodeAnnictId, setRecordEditId]);

  if (!active) return null;

  const close = () => {
    router.replace(`/anime/${annictId}`, { scroll: false });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="記録"
      className="fixed inset-0 z-50 bg-slate-700/70 overflow-y-auto"
    >
      <div className={`min-h-svh relative sm:py-24 sm:px-4 ${el ? 'py-24 px-4' : ''}`}>
        <button className="absolute inset-0" type="button" aria-label="閉じる" onClick={close} />

        <div className={`relative mx-auto bg-white dark:bg-black overflow-hidden sm:max-w-xl sm:rounded-lg sm:shadow-2xl ${el ? 'max-w-xl rounded-lg shadow-2xl' : ''}`}>
          {(el || ul) && <div className="p-8 text-center text-5xl text-annict-100"><RingSpinner /></div>}
          {(ee || ue) && <p className="p-4 text-red-500">{ee?.message || ue?.message}</p>}

          {!(el || ee || ul || ue) && <>
            {episode && user && work ? (
              <Contents work={work} episode={episode} user={user} libraryEntries={libraryEntries} onClose={close} />
            ) : (
              <div className="p-6 dark:text-white/70">
                <button onClick={close} className="block ml-auto" type="button" aria-label="閉じる">
                  <Icons id="close" type="navigation" className="text-2xl" />
                </button>
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
