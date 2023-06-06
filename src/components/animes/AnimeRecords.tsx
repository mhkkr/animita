'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { useQuery } from '@apollo/client';
import { searchEpisodesGql } from '~/features/apollo/gql/query/searchEpisodesGql';
import type { SearchEpisodesQuery, Episode, Record } from '~/features/apollo/generated-types';

import { useRecoilState, useSetRecoilState } from 'recoil';
import { recordDeleteIdAtom } from '~/atoms/recordDeleteIdAtom';
import { recordEditIdAtom } from '~/atoms/recordEditIdAtom';
import { recordCurrentEpisodeAnnictIdAtom } from '~/atoms/recordCurrentEpisodeAnnictIdAtom';
import { recordOpenerEpisodeAnnictIdAtom } from '~/atoms/recordOpenerEpisodeAnnictIdAtom';
import { recordShowNoCommentAtom } from '~/atoms/recordShowNoCommentAtom';

import Icons from '~/components/icons/Icons';

import DisplayDate from '~/components/dates/DisplayDate';
import { RingSpinner } from '~/components/spinners/Spinner';

import Delete from '~/components/animes/AnimeRecordDelete';
import Edit from '~/components/animes/AnimeRecordEdit';
import Favorite from '~/components/animes/AnimeRecordFavorite';
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

function Records({ records }: { records: Record[] }) {
  const { data: userSession } = useSession();
  const [recordShowNoComment] = useRecoilState(recordShowNoCommentAtom);
  const [recordDeleteId] = useRecoilState(recordDeleteIdAtom);
  const [recordEditId] = useRecoilState(recordEditIdAtom);

  function generateDateStyle({ date }: { date: Date }) {
    if (!date) return 0;
    return date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + date.getMinutes();
  }

  return (
    <ul className="flex flex-wrap text-sm">
      {records.map(record => {
        const ratingstate = Const.RATINGSTATE_LIST.find(RATINGSTATE => RATINGSTATE.id === record.ratingState);
        const isMyRecord = record.user.name === userSession?.user?.name;
        return (
          <li
            key={record.annictId}
            className={`
              p-4 border-t dark:border-white/25
              ${isMyRecord && 'order-first'}
              ${(record.comment || isMyRecord) ? 'w-full' : 'w-1/2 sm:w-1/3'}
              ${(!record.comment && !recordShowNoComment && !isMyRecord) && 'hidden'}
            `}
          >
            <div className={`
              transition-opacity
              ${recordDeleteId === record.id && 'opacity-50'}
              ${recordEditId === record.id && 'opacity-50'}
            `}>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 rounded-full overflow-hidden w-8 h-8">
                    <img className="object-cover w-full h-full" src={record.user?.avatarUrl || ''} alt={`${record.user.name}さんのアイコン`} loading="lazy" />
                  </div>
                  <div>{record.user.name}</div>
                </div>
                {isMyRecord &&
                  <>
                    <Edit record={record} />
                    <Delete record={record} />
                  </>
                }
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Favorite record={record} />
                {record.ratingState &&
                  <div className={`inline-flex items-center px-2 py-0.5 rounded-full ${ratingstate?.bgColor}`}>
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
            </div>
          </li>
        )
      })}
    </ul>
  );
}

function ViewerBody({ episodes }: { episodes: SearchEpisodesQuery }) {
  const { data: userSession } = useSession();

  const [recordShowNoComment, setRecordShowNoComment] = useRecoilState(recordShowNoCommentAtom);
  const episode = episodes?.searchEpisodes?.nodes ? (episodes?.searchEpisodes?.nodes[0] as Episode) : null;
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
            onClick={() => setRecordShowNoComment(prevState => !prevState)}
            className="flex items-center mx-auto pr-2 pl-4 py-1 border dark:border-white/30 rounded-full"
            type="button"
          >
            <span>コメントなしを{recordShowNoComment ? '非表示にする' : '表示する'}</span>
            <Icons id={recordShowNoComment ? 'arrow_drop_up' : 'arrow_drop_down'} type="navigation" className="text-[1.5em]" />
          </button>
        </div>
        <Records records={otherRecords} />
      </div>
    </>
  );
}

function Viewer() {
  const [recordOpenerEpisodeAnnictId] = useRecoilState(recordOpenerEpisodeAnnictIdAtom);
  const [recordCurrentEpisodeAnnictId] = useRecoilState(recordCurrentEpisodeAnnictIdAtom);

  const { data: episodes, loading, error } = useQuery<SearchEpisodesQuery>(searchEpisodesGql, {
    variables: { annictIds: [recordCurrentEpisodeAnnictId] }
  });

  return (
    <div className={`
      fixed inset-0 z-40 bg-slate-700/70 overflow-y-auto
      ${recordOpenerEpisodeAnnictId === 0 ? 'hidden' : 'block'}
    `}>
      <div className={`relative sm:py-24 sm:px-4 ${loading && 'py-24 px-4'}`}>
        <ToggleButton className="absolute inset-0" />

        <div className={`relative mx-auto dark:bg-black overflow-hidden sm:max-w-xl sm:rounded-lg sm:shadow-2xl ${loading && 'max-w-xl rounded-lg shadow-2xl'}`}>
          {loading && <div className="p-8 text-center text-5xl text-annict-100"><RingSpinner /></div>}
          {error && <p className="p-4 text-red-500">{error.message}</p>}

          {!(loading || error) && episodes && <ViewerBody episodes={episodes} />}
        </div>
      </div>
    </div>
  );
}