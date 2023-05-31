'use client';

import { useQuery } from '@apollo/client';
import { libraryEntriesGql } from '~/features/apollo/gql/libraryEntriesGql';
import type { Work, LibraryEntriesQuery } from '~/features/apollo/generated-types';

import { useRecoilState } from 'recoil';
import { recordViewerOpenIdAtom } from '~/atoms/recordViewerOpenIdAtom';

import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';

import StatuSstateIcon from '~/components/icons/StatuSstateIcon';
import FormIcon from '~/components/icons/FormIcon';

import DisplayDate from '~/components/dates/DisplayDate';
import * as Record from '~/components/AnimeRecords';

import Const from '~/constants';

const statusStateArray: string[] = [];
Const.STATUSSTATE_LIST.map(state => statusStateArray.push(state.id));

function checkViewable(work: Work, episodeIndex: number, now: number) {
  const { data, loading, error } = useQuery<LibraryEntriesQuery>(libraryEntriesGql, {
    variables: {
      states: statusStateArray,
      seasons: [`${work.seasonYear}-${work.seasonName?.toLowerCase()}`]
    }
  });
  if (loading) return { state: true, startedAt: '' };
  if (error) { console.error(error); return { state: true, startedAt: '' }; }
  
  const entry = data?.viewer?.libraryEntries?.nodes?.find(node => node?.work.annictId === work.annictId);
  const channel = entry?.nextProgram?.channel.name;

  const channelOnlyPrograms = work.programs?.nodes?.filter(program => program?.channel.name === channel);
  if (!channelOnlyPrograms) return { state: true, startedAt: '' };

  const program = channelOnlyPrograms[episodeIndex];
  const startedAt = new Date(program?.startedAt);
  const isViewable = now > startedAt.getTime();

  return { state: isViewable, startedAt: startedAt };
}

export default function Episodes({ work }: { work: Work }) {
  const [recordViewerOpenId] = useRecoilState(recordViewerOpenIdAtom);
  const episodes = work.episodes?.nodes ? Array.from(work.episodes?.nodes) : [];
  const now = Date.now();

  episodes.sort((a, b) => (a?.sortNumber as number) - (b?.sortNumber as number));

  return (
    <>
      <h2 className="px-4 pb-2 mb-2 font-bold border-b dark:border-white/25">エピソード</h2>
      <table className="w-full">
        {episodes.map((episode, episodeIndex) => {
          const viewable = checkViewable(work, episodeIndex, now);
          return (
            <tbody id={`episode-${episode?.annictId}`} key={episode?.annictId} className="relative">
              {episode?.annictId === recordViewerOpenId &&
                <tr><td colSpan={4} className="h-6"></td></tr>
              }
              <tr className={`
                ${episode?.annictId === recordViewerOpenId ? 'sticky -top-px z-10 bg-white dark:bg-black shadow-md border-t dark:border-white/25' : 'hover:bg-stone-500/30'}
                ${!viewable.state && 'dark:text-white/70'}
              `}>
                <td className={`
                  w-px whitespace-nowrap pl-4 align-top
                  ${!episode?.viewerDidTrack && '!w-0 !pl-2' /* 一話も視聴していない場合アイコンがすべて表示されないので幅の調整をしている */}
                  ${episode?.annictId === recordViewerOpenId ? 'py-3' : 'py-1'}
                `}>
                  {episode?.viewerDidTrack && <StatuSstateIcon id="WATCHED_CURRENT" className="text-[1.25em] align-[-.2em]" data-tooltip-id="episodes-tooltip" data-tooltip-content="視聴済み" data-tooltip-place="top" />}
                </td>
                
                <td className={`
                  w-px whitespace-nowrap pl-2 align-top
                  ${episode?.annictId === recordViewerOpenId ? 'py-3' : 'py-1'}
                `}>{episode?.numberText}</td>

                <td className={`
                  pl-3
                  ${episode?.annictId === recordViewerOpenId ? 'py-3' : 'py-1'}
                `}>
                  <div className="grid grid-cols-1 items-center gap-1">
                    <span>{episode?.title || '未定'}</span>
                    {!viewable.state && <span className="text-sm">予定日時：<DisplayDate date={viewable.startedAt} /></span>}
                  </div>
                </td>

                <td className={`
                  w-px whitespace-nowrap pl-3 pr-4 align-top text-xs
                  ${episode?.annictId === recordViewerOpenId ? 'py-3' : 'py-1'}
                `}>
                  {viewable.state &&
                    <Record.ToggleButton
                      className="inline-flex w-full px-2 py-1 border dark:border-white/30 rounded-full"
                      episodeAnnictId={episode?.annictId}
                    >
                      <FormIcon id="edit" className="text-[1.25em]" />
                      <span className="ml-0.5 mr-1">{episode?.viewerRecordsCount}</span>
                      <span className="flex-1 text-right">記録／変更</span>
                    </Record.ToggleButton>
                  }
                </td>
              </tr>
              {episode?.annictId && <Record.Viewer id={episode?.annictId} />}
            </tbody>
          );
        })}
      </table>
      <Tooltip id="episodes-tooltip" />
    </>
  );
}