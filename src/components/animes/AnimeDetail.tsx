"use client";

import { useEffect } from "react";

import { useQuery } from "@apollo/client/react";
import { searchWorksGql } from "~/features/apollo/gql/query/searchWorksGql";
import { useLibraryEntryDetail } from "~/features/apollo/hooks/useLibraryEntryDetail";
import type {
  LibraryEntryDetailQuery,
  SearchWorksQuery,
  Work,
} from "~/features/apollo/generated-types";
import type { LibraryEntriesData } from "~/types/libraryEntries";

import { useSetAtom } from "jotai";
import { statusStateIdAtom } from "~/atoms/statusStateIdAtom";

import Icons from "~/components/icons/Icons";

import BackButton from "~/components/buttons/BackButton";
import { RingSpinner } from "~/components/spinners/Spinner";

import Status from "~/components/animes/AnimeStatus";
import Thumbnail from "~/components/animes/AnimeThumbnail";
import AllEpisodes from "~/components/animes/AnimeAllEpisodes";
import Episodes from "~/components/animes/AnimeEpisodes";
import WorkRecords from "~/components/animes/AnimeWorkRecords";
import { Link, Channel, Staff, Cast } from "~/components/animes/AnimeInfo";

import Const from "~/constants";

type LibraryEntryNode = NonNullable<NonNullable<NonNullable<LibraryEntryDetailQuery["viewer"]>["libraryEntries"]>["nodes"]>[number];

function SetStatusState({ entry, work }: { entry: LibraryEntryNode | undefined, work: Work }) {
  const setStatusStateId = useSetAtom(statusStateIdAtom);

  useEffect(() => {
    const state = entry?.status?.state ?? work.viewerStatusState;
    if (state) {
      setStatusStateId(state);
    }
  }, [entry, work.viewerStatusState, setStatusStateId]);

  return <></>;
}

type AnimeDetailProps = {
  annictId: number;
  initialWork: Work | null;
  initialLibraryEntries: LibraryEntryDetailQuery | null;
  initialError?: string;
};

export default function AnimeDetail({
  annictId,
  initialWork,
  initialLibraryEntries,
  initialError,
}: AnimeDetailProps) {
  const skipClientWork = !!initialWork;
  const { data: worksData, loading: worksLoading, error: worksError } = useQuery<SearchWorksQuery>(searchWorksGql, {
    variables: { annictIds: [annictId] },
    skip: skipClientWork,
  });

  const work = initialWork
    ?? (worksData?.searchWorks?.nodes?.[0] as Work | undefined)
    ?? null;

  const skipClientLibrary = !!initialLibraryEntries || !work;
  const { data: clientLibraryEntries, loading: libraryEntriesLoading, error: libraryEntriesError } = useLibraryEntryDetail({
    seasons: work ? [`${work.seasonYear}-${work.seasonName?.toLowerCase()}`] : [],
    skip: skipClientLibrary,
  });

  const libraryEntries: LibraryEntriesData = initialLibraryEntries ?? clientLibraryEntries ?? null;
  const entry = libraryEntries?.viewer?.libraryEntries?.nodes?.find(
    (node) => node?.work.annictId === work?.annictId,
  );

  const loading = (!skipClientWork && worksLoading) || (!skipClientLibrary && libraryEntriesLoading);
  // サーバー失敗時はクライアント再取得を優先し、両方ダメなときだけエラー表示
  const error = worksError?.message
    || libraryEntriesError?.message
    || (!loading && !work ? initialError : undefined);

  return (
    <>
      <p><BackButton /></p>

      {loading && <div className="pt-12 border-t dark:border-stone-700 text-center text-5xl text-annict-100"><RingSpinner /></div>}
      {error && <p className="px-4 pt-6 border-t dark:border-stone-700 text-red-500">{error}</p>}

      {!(loading || error) &&
        <>
          {work ? (
            <>
              <SetStatusState entry={entry} work={work} />
              <Thumbnail work={work} view="detail" />
              <Link work={work} />
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-4 mt-4">
                <div className="flex-1">
                  <h1 className="font-bold text-lg">{work.title}</h1>
                </div>
                <div className="shrink-0 order-first sm:order-0">
                  <Status work={work} libraryEntries={libraryEntries ?? undefined} />
                </div>
              </div>
              <div className="px-4 mt-4">
                <ul className="flex flex-wrap gap-y-2 gap-x-4 mt-2 text-xs dark:text-white/70">
                  <li>視聴者数：{work.watchersCount}</li>
                  <li>評価数：{work.reviewsCount}</li>
                  <li>{work.seasonYear}年{Const.SEASON_LIST.find(season => season.id === work.seasonName)?.label}</li>
                  <li><Channel work={work} libraryEntries={libraryEntries ?? undefined} /></li>
                </ul>
                <Staff work={work} />
              </div>
              <div className="mt-6">
                <h2 className="px-4 pb-2 mb-2 font-bold border-b dark:border-stone-700">エピソード{work.malAnimeId && <AllEpisodes malAnimeId={work.malAnimeId} />}</h2>
                <Episodes work={work} libraryEntries={libraryEntries ?? undefined} />
              </div>
              <WorkRecords workId={work.id} annictId={work.annictId} reviewsCount={work.reviewsCount} />
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
