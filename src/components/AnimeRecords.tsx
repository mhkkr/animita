'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { useQuery } from '@apollo/client';
import { searchEpisodesGql } from '~/features/apollo/gql/searchEpisodesGql';
import type { SearchEpisodesQuery, Episode, Record } from '~/features/apollo/generated-types';

import { useRecoilState, useSetRecoilState } from 'recoil';
import { recordViewerAnnictIdAtom } from '~/atoms/recordViewerAnnictIdAtom';
import { recordViewerOpenIdAtom } from '~/atoms/recordViewerOpenIdAtom';
import { recordViewerShowNoCommentAtom } from '~/atoms/recordViewerShowNoCommentAtom';

import Icons from '~/components/icons/Icons';

import DisplayDate from '~/components/dates/DisplayDate';
import { RingSpinner } from '~/components/spinners/Spinner';

import Form from '~/components/AnimeRecordForm';
import Delete from '~/components/AnimeRecordDelete';

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
  const setRecordViewerAnnictId = useSetRecoilState(recordViewerAnnictIdAtom);
  const setRecordViewerOpenId = useSetRecoilState(recordViewerOpenIdAtom);
  const router = useRouter();

  return (
    <button 
      onClick={() => {
        if (workAnnictId) {
          router.push(`/anime/${workAnnictId}`);
        }
        if (!episodeAnnictId) {
          document.body.style.overflow = 'visible';
          setRecordViewerOpenId(0);
        } else {
          document.body.style.overflow = 'hidden';
          setRecordViewerAnnictId(episodeAnnictId ?? 0);
          setRecordViewerOpenId(episodeAnnictId ?? 0);
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

function Records({ records }: { records: Record[] }) {
  const { data: userSession } = useSession();
  const [recordViewerShowNoComment] = useRecoilState(recordViewerShowNoCommentAtom);

  function generateDateStyle({ date }: { date: Date }) {
    if (!date) return 0;
    return date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + date.getMinutes();
  }

  return (
    <ul className="flex flex-wrap text-sm">
      {records.map(record => {
        const ratingstate = Const.RATINGSTATE_LIST.find(RATINGSTATE => RATINGSTATE.id === record.ratingState);
        const isMy = record.user.name === userSession?.user?.name;
        return (
          <li
            key={record.annictId}
            className={`
              p-4 border-t dark:border-white/25
              ${isMy && 'order-first'}
              ${(record.comment || isMy) ? 'w-full' : 'w-1/2 sm:w-1/3'}
              ${(!record.comment && !recordViewerShowNoComment && !isMy) && 'hidden'}
            `}
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 rounded-full overflow-hidden w-8 h-8">
                  <img className="object-cover w-full h-full" src={record.user?.avatarUrl || ''} alt={`${record.user.name}さんのアイコン`} loading="lazy" />
                </div>
                <div>{record.user.name}</div>
              </div>
              {(isMy && record.id) &&
                <>
                  <button
                    className="inline-flex items-center"
                    type="button"
                  >
                    <Icons id="edit" type="form" className="mr-1" />
                    変更
                  </button>
                  <Delete recordId={record.id} />
                </>
              }
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {record.ratingState &&
                <div className={`inline-flex items-center px-2 py-0.5 rounded-full ${ratingstate?.bgColor}`}>
                  <Icons id={ratingstate?.id} type="rating_state" className="text-sm mr-1" />
                  {ratingstate?.label}
                </div>
              }
              <button
                className="inline-flex items-center"
                type="button"
              >
                <Icons id="favorite" type="form" className="mr-1" />
                {record.likesCount}
              </button>
              <div className="flex flex-wrap items-center gap-3">
                <span><DisplayDate date={record.createdAt} /></span>
                {generateDateStyle(record.createdAt) !== generateDateStyle(record.updatedAt) && <span className="dark:text-white/70 text-xs"><DisplayDate date={record.updatedAt} /></span>}
              </div>
            </div>
            {record.comment && <p className="mt-3 whitespace-pre-wrap">{record.comment}</p>}
          </li>
        )
      })}
    </ul>
  );
}

function ViewerBody() {
  const { data: userSession } = useSession();

  const [recordViewerAnnictId] = useRecoilState(recordViewerAnnictIdAtom);
  const [recordViewerShowNoComment, setRecordViewerShowNoComment] = useRecoilState(recordViewerShowNoCommentAtom);
  const { data, loading, error } = useQuery<SearchEpisodesQuery>(searchEpisodesGql, {
    variables: { annictIds: [recordViewerAnnictId] }
  });
  const episode = data?.searchEpisodes?.nodes ? (data?.searchEpisodes?.nodes[0] as Episode) : null;
  const records = episode?.records?.nodes ? Array.from(episode?.records?.nodes) : [];

  // // コメントありと評価ありを上側に表示
  // records.sort((a, b) => {
  //   const ac = a?.comment ? a?.comment.length : 0;
  //   const bc = b?.comment ? b?.comment.length : 0;
  //   const ar = a?.ratingState ? a?.ratingState.length : 0;
  //   const br = b?.ratingState ? b?.ratingState.length : 0;
  //   if (ac > bc) return -1;
  //   if (ac < bc) return 0;
  //   if (ar > br) return -1;
  //   if (ar < br) return 1;
  //   return 0;
  // });

  const mainRecords = records.filter(record => record?.comment || record?.user.name === userSession?.user?.name) as Record[];
  const otherRecords = records.filter(record => !record?.comment && record?.user.name !== userSession?.user?.name) as Record[];

  return (
    <>
      {loading && <div className="p-8 text-center text-5xl text-annict-100"><RingSpinner /></div>}
      {error && <p className="p-4 dark:text-white/70 border-y dark:border-white/25">{error.message}</p>}

      {!(loading || error) &&
        <>
          <div className="p-4">
            <div className="mb-3 flex gap-2">
              <span className="flex-shrink-0">{episode?.numberText}</span>
              <span className="flex-1">{episode?.title || '未定'}</span>
              <ToggleButton className="flex-shrink-0">
                <Icons id="close" type="navigation" className="text-2xl" />
              </ToggleButton>
            </div>
            {episode && <Form episode={episode} />}
          </div>
          <div className="grid grid-cols-3 border-t dark:border-white/25 text-xs text-center">
            <span className="p-4">全評価数：{episode?.recordsCount}</span>
            <span className="p-4 border-l dark:border-white/25">コメントあり：{records.filter(record => record?.comment).length}</span>
            <span className="p-4 border-l dark:border-white/25">自分の評価数：{episode?.viewerRecordsCount}</span>
          </div>
          <Records records={mainRecords} />
          <div className="border-t dark:border-white/25">
            <div className="my-6">
              <button
                onClick={() => setRecordViewerShowNoComment(prevState => !prevState)}
                className="flex items-center mx-auto pr-2 pl-4 py-1 border dark:border-white/30 rounded-full"
                type="button"
              >
                <span>コメントなしを{recordViewerShowNoComment ? '非表示にする' : '表示する'}</span>
                <Icons id={recordViewerShowNoComment ? 'arrow_drop_up' : 'arrow_drop_down'} type="navigation" className="text-[1.5em]" />
              </button>
            </div>
            <Records records={otherRecords} />
          </div>
        </>
      }
    </>
  );
}

function Viewer() {
  const [recordViewerOpenId] = useRecoilState(recordViewerOpenIdAtom);

  return (
    <div className={`
      fixed inset-0 z-40 bg-slate-700/70 overflow-y-auto
      ${recordViewerOpenId === 0 ? 'hidden' : 'block'}
    `}>
      <div className="relative py-24 px-4">
        <ToggleButton className="absolute inset-0" />
        <div className="relative max-w-xl mx-auto dark:bg-black rounded-lg overflow-hidden shadow-2xl">
          <ViewerBody />
        </div>
      </div>
    </div>
  );
}