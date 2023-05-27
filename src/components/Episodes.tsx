'use client';

import { useQuery } from '@apollo/client';
import { libraryEntriesGql } from '~/features/apollo/gql/libraryEntriesGql';
import type { Work, LibraryEntriesQuery } from '~/features/apollo/generated-types';

import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';

import DisplayDate from '~/components/dates/DisplayDate';
import { RecordOpenButton, RecordViewer } from '~/components/Records';

import Const from '~/constants';

const statusStateArray: string[] = [];
Const.STATE_LIST.map(state => statusStateArray.push(state.id));

function NextProgramDisplayDate({ work }: { work: Work }) {
  const { data, loading, error } = useQuery<LibraryEntriesQuery>(libraryEntriesGql, {
    variables: {
      states: statusStateArray,
      seasons: [`${work.seasonYear}-${work.seasonName?.toLowerCase()}`]
    }
  });
  if (loading) return <></>;
  if (error) { console.error(error); return <></>; }

  const entry = data?.viewer?.libraryEntries?.nodes?.find(node => node?.work.annictId === work.annictId);
  const startedAt = new Date(entry?.nextProgram?.startedAt);

  return <DisplayDate date={startedAt} />;
}

export default function Episodes({ work }: { work: Work }) {
  const episodes = work.episodes?.nodes?.filter(node => node !== null);
  if (!episodes) return <></>;

  episodes.sort((a, b) => (a?.sortNumber as number) - (b?.sortNumber as number));

  return (
    <>
      <h2 className="px-4 pb-2 mb-2 font-bold border-b dark:border-white/25">エピソード</h2>
      <table className="w-full">
        <tbody>
          {episodes.map(episode => {
            return (
              <tr key={episode?.id} className={`hover:bg-stone-500/30 ${episode?.viewerDidTrack ? '' : 'font-bold'}`}>
                <td className="w-px whitespace-nowrap py-1 pl-4 align-top">
                  {episode?.viewerDidTrack && <span className="material-symbols-outlined material-symbols-outlined--fill !text-[1.25em] align-[-.2em]" data-tooltip-id="my-tooltip" data-tooltip-content="視聴済み" data-tooltip-place="top">check_circle</span>}
                </td>
                <td className="w-px whitespace-nowrap py-1 pl-2 align-top">{episode?.numberText}</td>
                <td className="py-1 pl-3">{episode?.title || <>未定&nbsp;<span className="inline-block dark:text-white/70 text-sm">{<NextProgramDisplayDate work={work} />}&nbsp;配信開始</span></>}</td>
                <td className="w-px whitespace-nowrap py-1 pl-3 pr-4 align-top text-xs">
                  {episode?.title &&
                    <RecordOpenButton
                      className="inline-flex px-2 py-1 border dark:border-white/30 rounded-full"
                      annictId={episode.annictId}
                    >
                      <span className="material-symbols-outlined material-symbols-outlined--fill !text-[1.25em]">edit</span>
                      <span className="">{episode.viewerRecordsCount && episode.viewerRecordsCount}&nbsp;記録／編集</span>
                    </RecordOpenButton>
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Tooltip id="my-tooltip" />
      <RecordViewer />
    </>
  );
}