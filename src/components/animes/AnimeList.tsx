"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import type { LibraryEntriesQuery, LibraryEntry } from "~/features/apollo/generated-types";
import { useLibraryEntries } from "~/features/apollo/hooks/useLibraryEntries";

import Icons from "~/components/icons/Icons";

import DisplayDate from "~/components/dates/DisplayDate";
import { RingSpinner } from "~/components/spinners/Spinner";
import * as AnimeEpisode from "~/components/animes/AnimeEpisode";
import Thumbnail from "~/components/animes/AnimeThumbnail";

import {
  NO_PROGRAM_DAY,
  splitLibraryEntries,
  type AnimeListView,
  type EntriesByDay,
} from "~/libs/animeEntries";
import {
  DEFAULT_ANIME_LIST_STATUSES,
  getAnimeListStatuses,
} from "~/libs/settings";

import Const from "~/constants";

export type { AnimeListView };

function Detail({ entry, now }: { entry: EntriesByDay; now: number }) {
  if (entry.list.length === 0) {
    return <p className="p-4 dark:text-white/70">エピソードがありません！</p>;
  }

  return (
    <ul>
      {entry.list.map((item: LibraryEntry) => {
        const nextProgram = item?.nextProgram;
        const startedAt = nextProgram?.startedAt ? new Date(nextProgram.startedAt) : null;
        const isViewable = startedAt !== null && now > startedAt.getTime();

        return (
          <li key={item?.work.annictId} className="flex gap-4 p-4 border-b dark:border-stone-700">
            <div className="flex-shrink-0 w-28">
              <Link href={`/anime/${item?.work.annictId}`}>
                <Thumbnail work={item?.work} view="list" />
              </Link>
              {nextProgram?.channel.name && (
                <p className="mt-2 text-center text-xs dark:text-white/70">{nextProgram.channel.name}</p>
              )}
            </div>
            <div className="flex-1">
              {startedAt ? (
                <p className="text-sm dark:text-white/70"><DisplayDate date={startedAt} /></p>
              ) : (
                <p className="text-sm dark:text-white/70">放送情報がありません</p>
              )}
              <p className="mt-1 font-bold">
                <Link className="inline-block" href={`/anime/${item?.work.annictId}`}>{item?.work.title}</Link>
              </p>
              {nextProgram ? (
                <div className={`${isViewable ? "" : "cursor-text"}`}>
                  <AnimeEpisode.ToggleButton
                    className={`
                      flex w-full text-sm
                      ${isViewable ? "mt-1.5 px-4 py-2 border dark:border-white/30 rounded-3xl" : "mt-1 pointer-events-none"}
                    `}
                    workAnnictId={item?.work.annictId}
                    episodeAnnictId={nextProgram.episode?.annictId}
                    disabled={!isViewable}
                  >
                    <span className="flex-shrink-0 mr-2">{nextProgram.episode.numberText}</span>
                    <span className="flex-1 text-left">
                      {nextProgram.episode.title || Const.EPISODE_TITLE_UNDEFINED}
                    </span>
                  </AnimeEpisode.ToggleButton>
                </div>
              ) : (
                <p className="mt-2 text-sm dark:text-white/50">
                  詳細ページからエピソードを確認できます
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function NotEntry() {
  return (
    <div className="px-4 pt-6 dark:text-white/70">
      <Icons id="unknow" type="notification" className="table mx-auto mb-4 text-2xl" />
      <p className="text-center">エピソードがありません！</p>
    </div>
  );
}

function EntryList({ data, view }: { data: LibraryEntriesQuery | undefined; view: AnimeListView }) {
  const now = Date.now();
  const { delivered, all } = splitLibraryEntries(data, now);

  if (view === "delivered") {
    if (delivered.length === 0) {
      return <NotEntry />;
    }
    return <Detail entry={{ day: "視聴可能", list: delivered }} now={now} />;
  }

  if (all.length === 0) {
    return <NotEntry />;
  }

  return (
    <>
      {all.map((entry) => (
        <div key={entry.day} className="mt-12 first:mt-6">
          <div className="border-b dark:border-stone-700 p-4 text-lg font-bold">
            {entry.day === NO_PROGRAM_DAY ? entry.day : `${entry.day}曜日`}
          </div>
          <Detail entry={entry} now={now} />
        </div>
      ))}
    </>
  );
}

type AnimeListProps = {
  view: AnimeListView;
  title: string;
  icon: string;
};

export default function AnimeList({ view, title, icon }: AnimeListProps) {
  const [states, setStates] = useState<string[]>([...DEFAULT_ANIME_LIST_STATUSES]);
  const [settingsReady, setSettingsReady] = useState(false);

  useEffect(() => {
    setStates(getAnimeListStatuses());
    setSettingsReady(true);
  }, []);

  const { data, loading, error } = useLibraryEntries({
    states,
    skip: !settingsReady,
  });

  // ヘッダーは即表示。キャッシュがあればローディングなし、なければスピナー
  const showLoading = !data && (loading || !settingsReady);

  return (
    <div className="relative">
      <header className="sticky top-0 dark:bg-black/60 backdrop-blur-md border-b dark:border-stone-700">
        <h1 className="flex items-center justify-center p-4 text-xl font-bold">
          <Icons id={icon} type="navigation" className="mr-2 text-[1.5em]" />
          <span>{title}</span>
        </h1>
      </header>

      {showLoading && (
        <div className="mt-12 text-center text-5xl text-annict-100"><RingSpinner /></div>
      )}
      {error && <p className="p-4 text-red-500">{error.message}</p>}
      {!showLoading && !error && <EntryList data={data} view={view} />}
    </div>
  );
}
