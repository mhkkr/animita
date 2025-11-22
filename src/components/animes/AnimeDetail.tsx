'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

import { useQuery } from '@apollo/client/react';
import { searchWorksGql } from '~/features/apollo/gql/query/searchWorksGql';
import type { SearchWorksQuery, Work, LibraryEntriesQuery } from '~/features/apollo/generated-types';
import { useLibraryEntries } from '~/features/apollo/hooks/useLibraryEntries';

import { useAtom, useSetAtom } from 'jotai';
import { statusStateIdAtom } from '~/atoms/statusStateIdAtom';
import { recordEditIdAtom } from '~/atoms/recordEditIdAtom';
import { recordCurrentEpisodeAnnictIdAtom } from '~/atoms/recordCurrentEpisodeAnnictIdAtom';
import { recordOpenerEpisodeAnnictIdAtom } from '~/atoms/recordOpenerEpisodeAnnictIdAtom';

import Icons from '~/components/icons/Icons';

import BackButton from '~/components/buttons/BackButton';
import { RingSpinner } from '~/components/spinners/Spinner';

import Status from '~/components/animes/AnimeStatus';
import Thumbnail from '~/components/animes/AnimeThumbnail';
import AllEpisodes from '~/components/animes/AnimeAllEpisodes';
import Episodes from '~/components/animes/AnimeEpisodes';
// import Review from '~/components/animes/AnimeReview';
import { Link, Channel, Staff, Cast } from '~/components/animes/AnimeInfo';

import Const from '~/constants';

type LibraryEntryNode = NonNullable<NonNullable<NonNullable<LibraryEntriesQuery['viewer']>['libraryEntries']>['nodes']>[number];

function SetStatusState({ entry }: { entry: LibraryEntryNode | undefined }) {
  const setStatusStateId = useSetAtom(statusStateIdAtom);

  useEffect(() => {
    if (entry?.status?.state) {
      setStatusStateId(entry?.status?.state);
    }
  }, [entry, setStatusStateId]);
  
  return <></>;
}

export default function AnimeDetail({ annictId }: { annictId: number }) {
  const searchParams = useSearchParams();
  const setRecordEditId = useSetAtom(recordEditIdAtom);
  const setRecordCurrentEpisodeAnnictId = useSetAtom(recordCurrentEpisodeAnnictIdAtom);
  const [recordOpenerEpisodeAnnictId, setRecordOpenerEpisodeAnnictId] = useAtom(recordOpenerEpisodeAnnictIdAtom);
  const prevEpisodeIdRef = useRef<string | null>(null);

  const { data: worksData, loading: worksLoading, error: worksError } = useQuery<SearchWorksQuery>(searchWorksGql, {
    variables: { annictIds: [annictId] }
  });
  const work = worksData?.searchWorks?.nodes ? (worksData?.searchWorks?.nodes[0] as Work) : null;

  const { data: libraryEntries, loading: libraryEntriesLoading, error: libraryEntriesError } = useLibraryEntries({
    seasons: work ? [`${work.seasonYear}-${work.seasonName?.toLowerCase()}`] : [],
    skip: !work
  });
  const entry = libraryEntries?.viewer?.libraryEntries?.nodes?.find(node => node?.work.annictId === work?.annictId);

  // workが取得された後は、libraryEntriesのローディングを表示しない
  const loading = worksLoading || (!work && libraryEntriesLoading);
  const error = worksError || libraryEntriesError;

  // エピソードフォームを開く処理
  const openEpisodeForm = (episodeAnnictId: number) => {
    setRecordEditId('');
    document.body.style.overflow = 'hidden';
    setRecordCurrentEpisodeAnnictId(episodeAnnictId);
    setRecordOpenerEpisodeAnnictId(episodeAnnictId);
  };

  // エピソードフォームを閉じる処理
  const closeEpisodeForm = () => {
    setRecordOpenerEpisodeAnnictId(0);
    document.body.style.overflow = 'visible';
  };

  // URLパラメータからepisodeIdを取得し、フォームを開く
  useEffect(() => {
    if (loading || !work) return;

    const episodeId = searchParams.get('episodeId');
    
    // 閉じる処理が実行された直後（episodeIdがnullになり、状態が0の場合）は何もしない
    if (!episodeId && recordOpenerEpisodeAnnictId === 0 && prevEpisodeIdRef.current !== null) {
      prevEpisodeIdRef.current = null;
      return;
    }
    
    if (episodeId) {
      const episodeAnnictId = parseInt(episodeId, 10);
      if (isNaN(episodeAnnictId)) return;

      // URLパラメータと状態が一致している場合は何もしない（既に開いている）
      if (recordOpenerEpisodeAnnictId === episodeAnnictId) {
        prevEpisodeIdRef.current = episodeId;
        return;
      }

      openEpisodeForm(episodeAnnictId);
      prevEpisodeIdRef.current = episodeId;
    } else {
      // URLにepisodeIdがない場合は、状態も閉じる状態にする
      if (recordOpenerEpisodeAnnictId !== 0) {
        closeEpisodeForm();
      }
      prevEpisodeIdRef.current = null;
    }
  }, [searchParams, loading, work, recordOpenerEpisodeAnnictId, setRecordEditId, setRecordCurrentEpisodeAnnictId, setRecordOpenerEpisodeAnnictId]);

  return (
    <>
      <p><BackButton /></p>

      {loading && <div className="pt-12 border-t dark:border-stone-700 text-center text-5xl text-annict-100"><RingSpinner /></div>}
      {error && <p className="px-4 pt-6 border-t dark:border-stone-700 text-red-500">{error.message}</p>}

      {!(loading || error) &&
        <>
          {work ? (
            <>
              <SetStatusState entry={entry} />
              <Thumbnail work={work} view="detail" />
              <Link work={work} />
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-4 mt-4">
                <div className="flex-1">
                  <h1 className="font-bold text-lg">{work.title}</h1>
                </div>
                <div className="flex-shrink-0 order-first sm:order-none">
                  <Status work={work} libraryEntries={libraryEntries} />
                </div>
              </div>
              <div className="px-4 mt-4">
                <ul className="flex flex-wrap gap-y-2 gap-x-4 mt-2 text-xs dark:text-white/70">
                  <li>視聴者数：{work.watchersCount}</li>
                  <li>評価数：{work.reviewsCount}</li>
                  <li>{work.seasonYear}年{Const.SEASON_LIST.find(season => season.id === work.seasonName)?.label}</li>
                  <li><Channel work={work} libraryEntries={libraryEntries} /></li>
                </ul>
                <Staff work={work} />
              </div>
              <div className="mt-6">
                <h2 className="px-4 pb-2 mb-2 font-bold border-b dark:border-stone-700">エピソード{work.malAnimeId && <AllEpisodes malAnimeId={work.malAnimeId} />}</h2>
                <Episodes work={work} libraryEntries={libraryEntries} />
              </div>
              {/* <div className="mt-6">
                <h2 className="px-4 pb-2 mb-2 font-bold border-b dark:border-stone-700">レビュー</h2>
                <Review work={work} />
              </div> */}
              {/* <div className="mt-6">
                <h2 className="px-4 pb-2 mb-2 font-bold border-b dark:border-stone-700">視聴動向</h2>
                <Review work={work} />
              </div> */}
              <div className="mt-6">
                <h2 className="px-4 pb-2 mb-2 font-bold border-b dark:border-stone-700">キャスト</h2>
                <Cast work={work} />
              </div>
            </>
          ) : (
            <div className="px-4 pt-6 dark:text-white/70 border-t dark:border-stone-700">
              <Icons id="unknow" type="notification" className="table mx-auto mb-4 text-2xl" />
              <p className="text-center">詳細取得できませんでした。</p>
            </div>
          )}
        </>
      }
    </>
  );
}