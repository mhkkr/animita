'use client';

import { useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { useQuery } from '@apollo/client';
import { searchEpisodesGql } from '~/features/apollo/gql/searchEpisodesGql';
import type { SearchEpisodesQuery, Episode, Record } from '~/features/apollo/generated-types';

import { useRecoilState, useSetRecoilState } from 'recoil';
import { recordViewerAnnictIdAtom } from '~/atoms/recordViewerAnnictIdAtom';
import { recordViewerOpenIdAtom } from '~/atoms/recordViewerOpenIdAtom';

import FormIcon from '~/components/icons/FormIcon';
import RatingStateIcon from '~/components/icons/RatingStateIcon';

import DisplayDate from '~/components/dates/DisplayDate';
import { RingSpinner } from '~/components/spinners/Spinner';

import Form from '~/components/AnimeRecordForm';
import Delete from '~/components/AnimeRecordDelete';

import Const from '~/constants';

export {
  ToggleButton,
  Viewer
}

function ToggleButton({ children, episodeAnnictId, workAnnictId, className, disabled }: {
  children: React.ReactNode,
  episodeAnnictId: number | undefined,
  workAnnictId?: number | undefined,
  className: string,
  disabled?: boolean
}) {
  const setRecordViewerAnnictId = useSetRecoilState(recordViewerAnnictIdAtom);
  const [recordViewerOpenId, setRecordViewerOpenId] = useRecoilState(recordViewerOpenIdAtom);
  const router = useRouter();

  return (
    <button 
      onClick={() => {
        if (workAnnictId) {
          router.push(`/anime/${workAnnictId}`);
        }
        if (recordViewerOpenId === episodeAnnictId) {
          setRecordViewerOpenId(0);
        } else {
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

function ViewerBody({ id }: { id: number }) {
  const { data: userSession } = useSession();

  const [recordViewerAnnictId] = useRecoilState(recordViewerAnnictIdAtom);
  const [recordViewerOpenId] = useRecoilState(recordViewerOpenIdAtom);
  const { data, loading, error } = useQuery<SearchEpisodesQuery>(searchEpisodesGql, {
    variables: { annictIds: [recordViewerAnnictId] }
  });
  const episode = data?.searchEpisodes?.nodes ? (data?.searchEpisodes?.nodes[0] as Episode) : null;
  const records = episode?.records?.nodes ? Array.from(episode?.records?.nodes) : [];

  // コメントありと評価ありを上側に表示
  records.sort((a, b) => {
    const ac = a?.comment ? a?.comment.length : 0;
    const bc = b?.comment ? b?.comment.length : 0;
    const ar = a?.ratingState ? a?.ratingState.length : 0;
    const br = b?.ratingState ? b?.ratingState.length : 0;
    if (ac > bc) return -1;
    if (ac < bc) return 0;
    if (ar > br) return -1;
    if (ar < br) return 1;
    return 0;
  });

  // 自分の投稿を一番上にする（複数投稿にも対応）
  // TODO: user.name よりも annictID で比較をやるべき
  const myRecords = records.filter(record => record?.user.name === userSession?.user?.name);
  const replaceRecords: Record[] = [];
  myRecords.forEach(myRecord => {
    const record = records.find(record => record?.user.name === myRecord?.user.name);
    const index = records.findIndex(record => record?.user.name === myRecord?.user.name);
    if (record && index) {
      replaceRecords.push(record);
      records.splice(index, 1);
    }
  });
  records.forEach(record => replaceRecords.push(record as Record));

  const fixRecords = replaceRecords;

  useLayoutEffect(() => {
    if (!(loading || error)) {
      const tbody = document.getElementById(`episode-${recordViewerOpenId}`);
      if (tbody) tbody.scrollIntoView({ behavior: 'smooth' });
    }
  }, [recordViewerOpenId]);

  return (
    <tr>
      <td colSpan={4} className={`${recordViewerOpenId === id ? '' : 'hidden'}`}>
        {loading && <div className="mb-6 py-6 border-y dark:border-white/25 text-center text-5xl text-annict-100"><RingSpinner /></div>}
        {error && <p className="px-4 mb-6 py-6 dark:text-white/70 border-y dark:border-white/25">{error.message}</p>}

        {!(loading || error) &&
          <div className="mb-6 border-b dark:border-white/25">
            <div className="px-4 pb-4">
              <p className="mb-3 dark:text-white/70 text-sm">感想を書きましょう！</p>
              {episode && <Form episode={episode} />}
            </div>
            <div className="grid grid-cols-3 border-t dark:border-white/25 text-xs text-center">
              <span className="p-4">全評価数：{episode?.recordsCount}</span>
              <span className="p-4 border-l dark:border-white/25">コメントあり：{fixRecords.length - myRecords.length}</span>
              <span className="p-4 border-l dark:border-white/25">自分の評価数：{episode?.viewerRecordsCount}</span>
            </div>
            <ul>
              {fixRecords.map(record => {
                const ratingstate = Const.RATINGSTATE_LIST.find(RATINGSTATE => RATINGSTATE.id === record.ratingState);
                return (
                  <li key={record.annictId} className="p-4 border-t dark:border-white/25 text-sm">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="rounded-full overflow-hidden w-8 h-8">
                        <img className="object-cover w-full h-full" src={record.user?.avatarUrl || ''} alt={`${record.user.name}さんのアイコン`} loading="lazy" />
                      </div>
                      <div>{record.user.name}</div>
                      {record.user.name === userSession?.user?.name &&
                        <>
                          <button
                            className="inline-flex items-center"
                            type="button"
                          >
                            <FormIcon id="edit" className="mr-1" />
                            変更
                          </button>
                          <Delete recordId={record.id} />
                        </>
                      }
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      {record.ratingState &&
                        <div className={`inline-flex items-center px-2 py-0.5 rounded-full ${ratingstate?.bgColor}`}>
                          <RatingStateIcon id={ratingstate?.id} className="text-sm mr-1" />
                          {ratingstate?.label}
                        </div>
                      }
                      <div className="flex flex-wrap items-center gap-3">
                        <span><DisplayDate date={record.createdAt} /></span>
                        {record.createdAt !== record.updatedAt && <span className="dark:text-white/70 text-xs"><DisplayDate date={record.updatedAt} /></span>}
                      </div>
                      <button
                        className="inline-flex items-center"
                        type="button"
                      >
                        <FormIcon id="favorite" className="mr-1" />
                        {record.likesCount}
                      </button>
                    </div>
                    {record.comment && <p className="mt-3 whitespace-pre-wrap">{record.comment}</p>}
                  </li>
                )
              })}
            </ul>
          </div>
        }
      </td>
    </tr>
  );
}

function Viewer({ id }: { id: number }) {
  const [recordViewerAnnictId] = useRecoilState(recordViewerAnnictIdAtom);
  if (!recordViewerAnnictId) return <></>;

  return <ViewerBody id={id} />;
}