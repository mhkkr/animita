"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

import type { LibraryEntriesQuery, LibraryEntryDetailQuery, Work } from "~/features/apollo/generated-types";

import { useAtom, useSetAtom } from "jotai";
import { statusStateIdAtom } from "~/atoms/statusStateIdAtom";
import { recordEditIdAtom } from "~/atoms/recordEditIdAtom";
import { recordCurrentEpisodeAnnictIdAtom } from "~/atoms/recordCurrentEpisodeAnnictIdAtom";
import { recordOpenerEpisodeAnnictIdAtom } from "~/atoms/recordOpenerEpisodeAnnictIdAtom";

import Icons from "~/components/icons/Icons";

import BackButton from "~/components/buttons/BackButton";

import Status from "~/components/animes/AnimeStatus";
import Thumbnail from "~/components/animes/AnimeThumbnail";
import AllEpisodes from "~/components/animes/AnimeAllEpisodes";
import Episodes from "~/components/animes/AnimeEpisodes";
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
  annictId: _annictId,
  initialWork,
  initialLibraryEntries,
  initialError,
}: AnimeDetailProps) {
  const searchParams = useSearchParams();
  const setRecordEditId = useSetAtom(recordEditIdAtom);
  const setRecordCurrentEpisodeAnnictId = useSetAtom(recordCurrentEpisodeAnnictIdAtom);
  const [recordOpenerEpisodeAnnictId, setRecordOpenerEpisodeAnnictId] = useAtom(recordOpenerEpisodeAnnictIdAtom);
  const prevEpisodeIdRef = useRef<string | null>(null);

  const work = initialWork;
  const libraryEntries = initialLibraryEntries as LibraryEntriesQuery | null;
  const entry = libraryEntries?.viewer?.libraryEntries?.nodes?.find(
    (node) => node?.work.annictId === work?.annictId,
  );
  const error = initialError;

  const openEpisodeForm = (episodeAnnictId: number) => {
    setRecordEditId("");
    document.body.style.overflow = "hidden";
    setRecordCurrentEpisodeAnnictId(episodeAnnictId);
    setRecordOpenerEpisodeAnnictId(episodeAnnictId);
  };

  const closeEpisodeForm = () => {
    setRecordOpenerEpisodeAnnictId(0);
    document.body.style.overflow = "visible";
  };

  useEffect(() => {
    if (!work) return;

    const episodeId = searchParams.get("episodeId");

    if (!episodeId && recordOpenerEpisodeAnnictId === 0 && prevEpisodeIdRef.current !== null) {
      prevEpisodeIdRef.current = null;
      return;
    }

    if (episodeId) {
      const episodeAnnictId = parseInt(episodeId, 10);
      if (isNaN(episodeAnnictId)) return;

      if (recordOpenerEpisodeAnnictId === episodeAnnictId) {
        prevEpisodeIdRef.current = episodeId;
        return;
      }

      openEpisodeForm(episodeAnnictId);
      prevEpisodeIdRef.current = episodeId;
    } else {
      if (recordOpenerEpisodeAnnictId !== 0) {
        closeEpisodeForm();
      }
      prevEpisodeIdRef.current = null;
    }
  }, [searchParams, work, recordOpenerEpisodeAnnictId, setRecordEditId, setRecordCurrentEpisodeAnnictId, setRecordOpenerEpisodeAnnictId]);

  return (
    <>
      <p><BackButton /></p>

      {error && <p className="px-4 pt-6 border-t dark:border-stone-700 text-red-500">{error}</p>}

      {!error &&
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
                <div className="flex-shrink-0 order-first sm:order-none">
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
