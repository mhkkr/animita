'use client';

import { useEffect } from 'react';

import { useQuery } from '@apollo/client';
import { searchWorksGql } from '~/features/apollo/gql/query/searchWorksGql';
import { libraryEntriesGql } from '~/features/apollo/gql/query/libraryEntriesGql';
import type { SearchWorksQuery, Work, LibraryEntriesQuery } from '~/features/apollo/generated-types';

import { useSetAtom } from 'jotai';
import { statusStateIdAtom } from '~/atoms/statusStateIdAtom';

import Icons from '~/components/icons/Icons';

import BackButton from '~/components/buttons/BackButton';
import { RingSpinner } from '~/components/spinners/Spinner';

import Status from '~/components/animes/AnimeStatus';
import Thumbnail from '~/components/animes/AnimeThumbnail';
import AllEpisodes from '~/components/animes/AnimeAllEpisodes';
import Episodes from '~/components/animes/AnimeEpisodes';
import Review from '~/components/animes/AnimeReview';
import { Link, Channel, Staff, Cast } from '~/components/animes/AnimeInfo';

import Const from '~/constants';

const statusStateIdArray: string[] = [];
Const.STATUS_STATE_LIST.map(state => statusStateIdArray.push(state.id));

// TODO: setStatusStateId を実行したいだけで、この実装は苦しい気がする…。
function SetStatusState({ work }: { work: Work }) {
  const setStatusStateId = useSetAtom(statusStateIdAtom);
  const { data, loading, error } = useQuery<LibraryEntriesQuery>(libraryEntriesGql, {
    variables: {
      states: statusStateIdArray,
      seasons: [`${work.seasonYear}-${work.seasonName?.toLowerCase()}`]
    }
  });
  const entry = data?.viewer?.libraryEntries?.nodes?.find(node => node?.work.annictId === work.annictId);

  useEffect(() => {
    if (entry?.status?.state) {
      setStatusStateId(entry?.status?.state);
    }
  }, [entry]);
  
  if (loading) return <></>;
  if (error) { console.error(error); return <></>; }
  return <></>;
}

export default function AnimeDetail({ annictId }: { annictId: number }) {
  const { data, loading, error } = useQuery<SearchWorksQuery>(searchWorksGql, {
    variables: { annictIds: [annictId] }
  });
  const work = data?.searchWorks?.nodes ? (data?.searchWorks?.nodes[0] as Work) : null;

  return (
    <>
      <p><BackButton /></p>

      {loading && <div className="pt-12 border-t dark:border-stone-700 text-center text-5xl text-annict-100"><RingSpinner /></div>}
      {error && <p className="px-4 pt-6 border-t dark:border-stone-700 text-red-500">{error.message}</p>}

      {!(loading || error) &&
        <>
          {work ? (
            <>
              <SetStatusState work={work} />
              <Thumbnail work={work} view="detail" />
              <Link work={work} />
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-4 mt-4">
                <div className="flex-1">
                  <h1 className="font-bold text-lg">{work.title}</h1>
                </div>
                <div className="flex-shrink-0 order-first sm:order-none">
                  <Status work={work} />
                </div>
              </div>
              <div className="px-4 mt-4">
                <ul className="flex flex-wrap gap-y-2 gap-x-4 mt-2 text-xs dark:text-white/70">
                  <li>視聴者数：{work.watchersCount}</li>
                  <li>評価数：{work.reviewsCount}</li>
                  <li>{work.seasonYear}年{Const.SEASON_LIST.find(season => season.id === work.seasonName)?.label}</li>
                  <li><Channel work={work} /></li>
                </ul>
                <Staff work={work} />
              </div>
              <div className="mt-6">
                <h2 className="px-4 pb-2 mb-2 font-bold border-b dark:border-stone-700">エピソード{work.malAnimeId && <AllEpisodes malAnimeId={work.malAnimeId} />}</h2>
                <Episodes work={work} />
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