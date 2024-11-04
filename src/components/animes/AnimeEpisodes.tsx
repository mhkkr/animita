'use client';

import { useQuery } from '@apollo/client';
import { libraryEntriesGql } from '~/features/apollo/gql/query/libraryEntriesGql';
import type { Work, Episode, LibraryEntriesQuery } from '~/features/apollo/generated-types';

import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';

import Icons from '~/components/icons/Icons';

import DisplayDate from '~/components/dates/DisplayDate';
import { RingSpinner } from '~/components/spinners/Spinner';
import * as AnimeEpisode from '~/components/animes/AnimeEpisode';

import Const from '~/constants';

const statusStateIdArray: string[] = [];
Const.STATUS_STATE_LIST.map(state => statusStateIdArray.push(state.id));

// エピソードが視聴可能かの判定と配信開始時刻を返却する
function episodeStatus(libraryEntries: LibraryEntriesQuery, work: Work, episodeIndex: number, now: number) {
  const entry = libraryEntries?.viewer?.libraryEntries?.nodes?.find(node => node?.work.annictId === work.annictId);

  const channelSomePrograms = work.programs?.nodes?.filter(program => program?.channel.name === entry?.nextProgram?.channel.name);
  if (!channelSomePrograms) return { available: true, startedAt: '' };

  const program = channelSomePrograms[episodeIndex];
  if (!program) return { available: true, startedAt: '' };

  const startedAt = new Date(program?.startedAt);

  return {
    available: now > startedAt.getTime(),
    startedAt: startedAt
  };
}

export default function Episodes({ work }: { work: Work }) {
  const { data: libraryEntries, loading, error } = useQuery<LibraryEntriesQuery>(libraryEntriesGql, {
    variables: {
      states: statusStateIdArray,
      seasons: [`${work.seasonYear}-${work.seasonName?.toLowerCase()}`]
    }
  });
  if (loading || !libraryEntries) return <div className="mt-6 text-center text-5xl text-annict-100"><RingSpinner /></div>;
  if (error) { console.error(error); return <></>; }

  const episodes = (work.episodes?.nodes ? Array.from(work.episodes?.nodes) : []) as Episode[];
  const now = Date.now();

  episodes.sort((a, b) => (a?.sortNumber as number) - (b?.sortNumber as number));

  return (
    <>
      <table className="w-full">
        {episodes.map((episode, episodeIndex) => {
          const status = episodeStatus(libraryEntries, work, episodeIndex, now);
          return (
            <tbody key={episode?.annictId} className="relative">
              <tr className={`hover:bg-stone-500/30 ${!status.available && 'dark:text-white/70'}`}>
                <td className={`
                  hidden sm:table-cell
                  w-px whitespace-nowrap pl-4 py-1.5 pt-[.55rem] align-top
                  ${!episode?.viewerDidTrack && '!w-0 !pl-2' /* 一話も視聴していない場合アイコンがすべて表示されないので幅の調整をしている */}
                `}>
                  {episode?.viewerDidTrack && <Icons id="WATCHED_CURRENT" type="status_state" className="text-[1.25em] align-[-.2em]" data-tooltip-id="episodes-tooltip" data-tooltip-content="視聴済み" data-tooltip-place="top" />}
                </td>
                
                <td className="w-px whitespace-nowrap pl-4 sm:pl-2 align-top py-1.5 pt-[.55rem]">{episode?.numberText}</td>

                <td className="pl-3 py-1.5 pt-[.55rem] align-top">
                  <div>{episode?.title || Const.EPISODE_TITLE_UNDEFINED}</div>
                  {!status.available && <div className="mt-1 text-sm">予定日時：<DisplayDate date={status.startedAt} /></div>}
                </td>

                <td className="w-px whitespace-nowrap pl-3 pr-4 align-top text-xs py-1.5">
                  {status.available &&
                    <AnimeEpisode.ToggleButton
                      className={`
                        inline-flex w-full px-2 py-1.5 border dark:border-white/30 rounded-full
                        ${episode?.viewerDidTrack && 'bg-black text-white dark:bg-white dark:text-black'}
                      `}
                      episodeAnnictId={episode?.annictId}
                    >
                      <Icons id="edit" type="form" className="text-[1.25em]" />
                      <span className="ml-0.5 mr-1">{episode?.viewerRecordsCount}</span>
                      <span className="flex-1 text-right">記録する</span>
                    </AnimeEpisode.ToggleButton>
                  }
                </td>
              </tr>
            </tbody>
          );
        })}
      </table>
      <Tooltip id="episodes-tooltip" />
      <AnimeEpisode.Episode work={work} />
    </>
  );
}