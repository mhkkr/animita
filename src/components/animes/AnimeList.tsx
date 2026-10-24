"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import type { LibraryEntriesQuery, LibraryEntry } from "~/features/apollo/generated-types";
import { useLibraryEntries } from "~/features/apollo/hooks/useLibraryEntries";

import Icons from "~/components/icons/Icons";

import DisplayDate from "~/components/dates/DisplayDate";
import { RingSpinner } from "~/components/spinners/Spinner";
import { RecordLink } from "~/components/animes/AnimeEpisode";
import Thumbnail from "~/components/animes/AnimeThumbnail";

import {
  splitLibraryEntries,
  type EntriesByDay,
} from "~/libs/animeEntries";
import {
  DEFAULT_ANIME_LIST_STATUSES,
  getAnimeListStatuses,
} from "~/libs/settings";

import Const from "~/constants";

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
            <div className="shrink-0 w-18">
              <Link href={`/anime/${item?.work.annictId}`}>
                <Thumbnail work={item?.work} view="list" />
              </Link>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs dark:text-white/70">
                <StatusLabel statusId={item?.status?.state} />
                {startedAt ? (
                  <>
                    <p><DisplayDate date={startedAt} /></p>
                    {nextProgram?.channel.name && (
                      <p>{nextProgram.channel.name}</p>
                    )}
                  </>
                ) : (
                  <p>放送情報がありません</p>
                )}
              </div>
              <p className="mt-1 font-bold">
                <Link className="inline-block" href={`/anime/${item?.work.annictId}`}>{item?.work.title}</Link>
              </p>
              {nextProgram && item?.work.annictId && nextProgram.episode?.annictId && (
                <div className={`${isViewable ? "" : "cursor-text"}`}>
                  {isViewable ? (
                    <RecordLink
                      className="flex w-full mt-2 px-4 py-2 border dark:border-white/30 rounded-3xl text-sm"
                      workAnnictId={item.work.annictId}
                      episodeAnnictId={nextProgram.episode.annictId}
                    >
                      <span className="shrink-0 mr-2">{nextProgram.episode.numberText}</span>
                      <span className="flex-1 text-left">
                        {nextProgram.episode.title || Const.EPISODE_TITLE_UNDEFINED}
                      </span>
                    </RecordLink>
                  ) : (
                    <div className="flex w-full mt-1.5 text-sm pointer-events-none">
                      <span className="shrink-0 mr-2">{nextProgram.episode.numberText}</span>
                      <span className="flex-1 text-left">
                        {nextProgram.episode.title || Const.EPISODE_TITLE_UNDEFINED}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function StatusLabel({ statusId }: { statusId?: string | null }) {
  const statusState = Const.STATUS_STATE_LIST.find((state) => state.id === statusId);
  if (!statusState) {
    return null;
  }

  return (
    <p className={`flex items-center gap-0.5 ${statusState.color}`}>
      <Icons
        id={`${statusState.id}_CURRENT`}
        type="status_state"
        className="text-[1.25em]"
        aria-hidden="true"
      />
      {statusState.label}
    </p>
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

function SectionTitle({
  icon,
  iconType = "navigation",
  children,
}: {
  icon: string;
  iconType?: string;
  children: string;
}) {
  return (
    <h2 className="flex items-center border-b dark:border-stone-700 p-4 text-lg font-bold">
      <Icons id={icon} type={iconType} className="mr-2 text-[1.25em]" />
      <span>{children}</span>
    </h2>
  );
}

function EntryList({ data }: { data: LibraryEntriesQuery | undefined }) {
  const now = Date.now();
  const { delivered, all, noProgram } = splitLibraryEntries(data, now);

  if (delivered.length === 0 && all.length === 0 && noProgram.length === 0) {
    return <NotEntry />;
  }

  return (
    <>
      <section className="mt-6">
        <SectionTitle icon="play">現在配信中</SectionTitle>
        {delivered.length === 0 ? (
          <p className="p-4 dark:text-white/70">エピソードがありません！</p>
        ) : (
          <Detail entry={{ day: "現在配信中", list: delivered }} now={now} />
        )}
      </section>
      <section className="mt-12">
        <SectionTitle icon="calendar">週間予定</SectionTitle>
        {all.length === 0 ? (
          <p className="p-4 dark:text-white/70">エピソードがありません！</p>
        ) : (
          all.map((entry) => (
            <div key={entry.day}>
              <div className="border-b dark:border-stone-700 p-4 mt-4 font-bold">
                {`${entry.day}曜日`}
              </div>
              <Detail entry={entry} now={now} />
            </div>
          ))
        )}
      </section>
      {noProgram.length > 0 && (
        <section className="mt-12">
          <SectionTitle icon="unknow" iconType="notification">放送情報なし</SectionTitle>
          <Detail entry={{ day: "放送情報なし", list: noProgram }} now={now} />
        </section>
      )}
    </>
  );
}

type AnimeListProps = {
  title: string;
  icon: string;
};

export default function AnimeList({ title, icon }: AnimeListProps) {
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
      <header className="z-10 sticky top-0 dark:bg-black/60 backdrop-blur-md border-b dark:border-stone-700">
        <h1 className="flex items-center justify-center p-4 text-xl font-bold">
          <Icons id={icon} type="navigation" className="mr-2 text-[1.5em]" />
          <span>{title}</span>
        </h1>
      </header>

      {showLoading && (
        <div className="mt-12 text-center text-5xl text-annict-100"><RingSpinner /></div>
      )}
      {error && <p className="p-4 text-red-500">{error.message}</p>}
      {!showLoading && !error && (
        <EntryList data={data} />
      )}
    </div>
  );
}
