"use client";

import { useEffect } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { useQuery } from "@apollo/client/react";
import { searchWorksGql } from "~/features/apollo/gql/query/searchWorksGql";
import { useLibraryEntryDetail } from "~/features/apollo/hooks/useLibraryEntryDetail";
import type {
  LibraryEntryDetailQuery,
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
import RelatedWorks from "~/components/animes/AnimeRelatedWorks";
import { Link, Channel, Staff, Cast, StreamServices } from "~/components/animes/AnimeInfo";

import Const from "~/constants";

type LibraryEntryNode = NonNullable<NonNullable<NonNullable<LibraryEntryDetailQuery["viewer"]>["libraryEntries"]>["nodes"]>[number];

function SetStatusState({ entry, work }: { entry: LibraryEntryNode | undefined, work: Work }) {
  const setStatusStateId = useSetAtom(statusStateIdAtom);

  useEffect(() => {
    const state = entry?.status?.state ?? work.viewerStatusState;
    setStatusStateId(state || "NO_STATE");
  }, [entry, work.viewerStatusState, setStatusStateId]);

  return <></>;
}

const DETAIL_TABS = [
  { id: "episodes", label: "トップ" },
  { id: "records", label: "記録" },
  { id: "related", label: "関連作品" },
] as const;

type DetailTab = (typeof DETAIL_TABS)[number]["id"];

function detailTabFromPathname(pathname: string, annictId: number): DetailTab {
  if (pathname === `/anime/${annictId}/records`) return "records";
  if (pathname === `/anime/${annictId}/related_works`) return "related";
  return "episodes";
}

function detailTabHref(annictId: number, tab: DetailTab) {
  if (tab === "records") return `/anime/${annictId}/records`;
  if (tab === "related") return `/anime/${annictId}/related_works`;
  return `/anime/${annictId}`;
}

function DetailTabs({
  work,
  libraryEntries,
}: {
  work: Work;
  libraryEntries: LibraryEntriesData;
}) {
  const pathname = usePathname();
  const tab = detailTabFromPathname(pathname, work.annictId);

  return (
    <div className="mt-6">
      <div role="tablist" aria-label="作品の詳細" className="sticky top-0 z-10 flex border-b dark:border-white/25 bg-white/60 dark:bg-black/60 backdrop-blur-md">
        {DETAIL_TABS.map((item) => {
          const selected = tab === item.id;
          return (
            <NextLink
              key={item.id}
              href={detailTabHref(work.annictId, item.id)}
              scroll={false}
              className={`
                relative flex-1 px-4 py-3 text-center
                after:content-[''] after:block after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-8 after:h-1 after:bg-annict-100 after:rounded-full
                ${selected ? "font-bold" : "dark:text-white/70 after:hidden"}
              `}
              role="tab"
              aria-selected={selected}
            >
              {item.label}
            </NextLink>
          );
        })}
      </div>
      {tab === "episodes" && (
        <div role="tabpanel" className="mt-6">
          <h2 className="px-4 pb-2 mb-2 font-bold border-b dark:border-stone-700">エピソード{work.malAnimeId && <AllEpisodes malAnimeId={work.malAnimeId} />}</h2>
          <Episodes work={work} libraryEntries={libraryEntries ?? undefined} />
          <div className="mt-6">
            <h2 className="px-4 pb-2 mb-2 font-bold border-b dark:border-stone-700">キャスト</h2>
            <Cast work={work} />
            <StreamServices work={work} />
          </div>
        </div>
      )}
      {tab === "records" && (
        <div role="tabpanel">
          <WorkRecords workId={work.id} annictId={work.annictId} reviewsCount={work.reviewsCount} />
        </div>
      )}
      {tab === "related" && (
        <div role="tabpanel">
          <RelatedWorks annictId={work.annictId} />
        </div>
      )}
    </div>
  );
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
  // サーバーの initialWork だけだと、記録後に viewerDidTrack がキャッシュへ入っても一覧が追従しない。
  const { data: worksData, loading: worksLoading, error: worksError } = useQuery(searchWorksGql, {
    variables: { annictIds: [annictId] },
    fetchPolicy: "cache-and-network",
  });

  const work = (worksData?.searchWorks?.nodes?.[0] as Work | undefined)
    ?? initialWork
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

  // 取得中でも initialWork があれば一覧を出したままにする。バックグラウンド更新で画面を消さない。
  const loading = (!work && worksLoading) || (!skipClientLibrary && libraryEntriesLoading && !libraryEntries);
  const error = work
    ? undefined
    : worksError?.message
      || libraryEntriesError?.message
      || (!loading ? initialError : undefined);

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
                  <li>{work.media}</li>
                  <li><Channel work={work} libraryEntries={libraryEntries} /></li>
                </ul>
                <Staff work={work} />
              </div>
              <DetailTabs work={work} libraryEntries={libraryEntries} />
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
