'use client';

import type { Work, Episode, LibraryEntriesQuery } from '~/features/apollo/generated-types';

import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';

import Icons from '~/components/icons/Icons';

import DisplayDate from '~/components/dates/DisplayDate';
import * as AnimeEpisode from '~/components/animes/AnimeEpisode';

import Const from '~/constants';

/** 閑話・総集編など、今期話数の対象外 */
const SPECIAL_EPISODE_PATTERN = /閑話|総集編|ダイジェスト|特別編|振り返り|ハイライト/;

function isSpecialEpisode(episode: Episode | null | undefined) {
  if (!episode) return true;
  if (episode.number == null) return true;
  const text = `${episode.numberText ?? ""} ${episode.title ?? ""}`;
  return SPECIAL_EPISODE_PATTERN.test(text);
}

// エピソードが視聴可能かの判定と配信開始時刻を返却する
function episodeStatus(libraryEntries: LibraryEntriesQuery | null | undefined, work: Work, episodeIndex: number, now: number) {
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

export default function Episodes({ work, libraryEntries }: { work: Work, libraryEntries?: LibraryEntriesQuery | null }) {
  const episodes = (work.episodes?.nodes ? Array.from(work.episodes?.nodes) : []) as Episode[];
  const now = Date.now();

  episodes.sort((a, b) => (a?.sortNumber as number) - (b?.sortNumber as number));

  const storyEpisodes = episodes.filter((episode) => !isSpecialEpisode(episode));
  const minNumber = storyEpisodes.length > 0
    ? Math.min(...storyEpisodes.map((episode) => episode.number as number))
    : null;
  const showSeasonOrdinal = minNumber != null && minNumber > 1;

  return (
    <>
      <table className="w-full">
        <tbody>
          {episodes.map((episode, episodeIndex) => {
            const status = episodeStatus(libraryEntries, work, episodeIndex, now);
            const seasonOrdinal = showSeasonOrdinal && !isSpecialEpisode(episode)
              ? (episode.number as number) - minNumber + 1
              : null;

            return (
              <tr key={episode?.annictId} className={`hover:bg-stone-500/30 ${!status.available && 'dark:text-white/70'}`}>
                <td className={`
                  hidden sm:table-cell
                  w-px whitespace-nowrap pl-4 py-1.5 pt-[.55rem] align-top
                  ${!episode?.viewerDidTrack && '!w-0 !pl-2' /* 一話も視聴していない場合アイコンがすべて表示されないので幅の調整をしている */}
                `}>
                  {episode?.viewerDidTrack && <Icons id="WATCHED_CURRENT" type="status_state" className="text-[1.25em] mt-[.15em]" data-tooltip-id="episodes-tooltip" data-tooltip-content="視聴済み" data-tooltip-place="top" />}
                </td>
                
                <td className="w-px whitespace-nowrap pl-4 sm:pl-2 align-top py-1.5 pt-[.55rem]">
                  <div className="relative">
                    {seasonOrdinal != null && (
                      <span className="absolute bottom-full left-0 text-[.65rem] leading-tight dark:text-white/70">今期<span className="px-px">{seasonOrdinal}</span>話</span>
                    )}
                    {episode?.numberText}
                  </div>
                </td>

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
                      workAnnictId={work.annictId}
                    >
                      <Icons id="edit" type="form" className="text-[1.25em]" />
                      <span className="ml-0.5 mr-1">{episode?.viewerRecordsCount}</span>
                      <span className="flex-1 text-right">記録する</span>
                    </AnimeEpisode.ToggleButton>
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Tooltip id="episodes-tooltip" />
      <AnimeEpisode.Episode work={work} libraryEntries={libraryEntries ?? undefined} />
    </>
  );
}