"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ApolloClient } from "@apollo/client";
import { useApolloClient } from "@apollo/client/react";

import {
  currentSeasonWorksGql,
  type SeasonWork,
} from "~/features/apollo/gql/query/currentSeasonWorksGql";

import Icons from "~/components/icons/Icons";
import { RingSpinner } from "~/components/spinners/Spinner";
import AnimeWorkItem from "~/components/animes/AnimeWorkItem";

import Const from "~/constants";
import { worksSeasonTabFromPathname, worksSeasonTabHref } from "~/libs/worksTab";
import { adjacentSeasons } from "~/libs/season";

const SEASON_WORKS_LIMIT = 500;

const SEASON_TABS = [
  { id: "previous", label: "前期" },
  { id: "current", label: "今期" },
  { id: "next", label: "来期" },
] as const;

type MediaId = (typeof Const.MEDIA_FILTERS)[number]["id"];

const STATUS_FILTERS = [
  { id: "NO_STATE", label: "未選択" },
  ...Const.STATUS_STATE_LIST.map((state) => ({ id: state.id, label: state.label })),
];

const DEFAULT_STATUS_FILTERS = ["NO_STATE", "WATCHED", "ON_HOLD", "STOP_WATCHING"];

function byPopularity(a: SeasonWork, b: SeasonWork) {
  return b.watchersCount - a.watchersCount || b.reviewsCount - a.reviewsCount;
}

function statusFilterId(work: SeasonWork) {
  if (!work.viewerStatusState || work.viewerStatusState === "NO_STATE") return "NO_STATE";
  return work.viewerStatusState;
}

function readSeasonWorks(client: ApolloClient, seasonKey: string) {
  try {
    const data = client.readQuery({
      query: currentSeasonWorksGql,
      variables: { seasons: [seasonKey], first: SEASON_WORKS_LIMIT },
    });
    if (!data?.searchWorks) return null;
    const collected: SeasonWork[] = [];
    for (const node of data.searchWorks.nodes ?? []) {
      if (node) collected.push(node);
    }
    return collected.sort(byPopularity);
  } catch {
    return null;
  }
}

export default function AnimeWorks() {
  const client = useApolloClient();
  const tab = worksSeasonTabFromPathname(usePathname());
  const seasons = adjacentSeasons();
  const season = tab ? seasons[tab] : seasons.current;
  const [mediaFilters, setMediaFilters] = useState<Set<MediaId>>(() => new Set<MediaId>(["TV"]));
  const [statusFilters, setStatusFilters] = useState<Set<string>>(() => new Set(DEFAULT_STATUS_FILTERS));
  const [works, setWorks] = useState<SeasonWork[]>(() => readSeasonWorks(client, season.key) ?? []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedSeasonKey, setLoadedSeasonKey] = useState(season.key);

  if (tab && loadedSeasonKey !== season.key) {
    setLoadedSeasonKey(season.key);
    setWorks(readSeasonWorks(client, season.key) ?? []);
    setError(null);
    setLoading(true);
  }

  useEffect(() => {
    let cancelled = false;

    if (!tab) return;

    const cached = readSeasonWorks(client, season.key);
    if (cached) {
      setWorks(cached);
      setError(null);
    }
    setLoading(true);

    async function load() {
      try {
        const result = await client.query({
          query: currentSeasonWorksGql,
          variables: { seasons: [season.key], first: SEASON_WORKS_LIMIT },
          fetchPolicy: "network-only",
        });
        if (cancelled) return;
        if (result.error) {
          throw result.error;
        }

        const collected: SeasonWork[] = [];
        for (const node of result.data?.searchWorks?.nodes ?? []) {
          if (node) collected.push(node);
        }
        if (!cancelled) setWorks(collected.sort(byPopularity));
      } catch (cause) {
        if (!cancelled && !cached) {
          setError(cause instanceof Error ? cause.message : "取得に失敗しました");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [client, season.key, tab]);

  const visibleWorks = works.filter((work) => mediaFilters.has(work.media) && statusFilters.has(statusFilterId(work)));
  const showLoading = loading && works.length === 0;

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const toggleMedia = (id: MediaId) => {
    setMediaFilters((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    scrollToTop();
  };

  const toggleStatus = (id: string) => {
    setStatusFilters((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    scrollToTop();
  };

  if (!tab) return null;

  return (
    <div className="relative">
      <header className="border-b dark:border-stone-700">
        <h1 className="flex items-center justify-center p-4 text-xl font-bold">
          <Icons id="explore" type="navigation" className="mr-2 text-[1.5em]" />
          <span>見つける</span>
        </h1>
        <p className="px-4 pb-4 -mt-2 text-center text-sm dark:text-white/70">
          {season.label}の作品を人気順に表示します。
        </p>
      </header>
      <div className="sticky top-0 z-10 border-b dark:border-stone-700 bg-white/60 dark:bg-black/60 backdrop-blur-md">
        <div role="tablist" aria-label="配信時期" className="flex border-b dark:border-stone-700">
          {SEASON_TABS.map((item) => {
            const selected = tab === item.id;
            return (
              <Link
                key={item.id}
                href={worksSeasonTabHref(item.id)}
                role="tab"
                aria-selected={selected}
                className={`relative flex-1 px-2 py-2 text-center text-sm after:content-[''] after:block after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-8 after:h-1 after:bg-annict-100 after:rounded-full ${selected ? "font-bold" : "dark:text-white/70 after:hidden"}`}
                onClick={(event) => {
                  if (selected) event.preventDefault();
                }}
              >
                {item.label}
                <span className="mt-0.5 block text-xs font-normal text-black/50 dark:text-white/70">{seasons[item.id].label}</span>
              </Link>
            );
          })}
        </div>
        <div className="grid gap-2 p-4">
          <div role="group" aria-label="媒体" className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {Const.MEDIA_FILTERS.map((filter) => (
              <label key={filter.id} className="inline-flex items-center gap-1 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="size-3.5 accent-annict-100"
                  checked={mediaFilters.has(filter.id)}
                  onChange={() => toggleMedia(filter.id)}
                />
                {filter.label}
              </label>
            ))}
          </div>
          <div role="group" aria-label="視聴ステータス" className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {STATUS_FILTERS.map((filter) => (
              <label key={filter.id} className="inline-flex items-center gap-1 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="size-3.5 accent-annict-100"
                  checked={statusFilters.has(filter.id)}
                  onChange={() => toggleStatus(filter.id)}
                />
                {filter.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {showLoading && (
        <div className="mt-12 text-center text-5xl text-annict-100"><RingSpinner /></div>
      )}
      {error && <p className="p-4 text-red-500">{error}</p>}
      {!showLoading && !error && works.length === 0 && (
        <div className="px-4 pt-6 dark:text-white/70">
          <Icons id="unknow" type="notification" className="table mx-auto mb-4 text-2xl" />
          <p className="text-center">{season.label}の作品はありません。</p>
        </div>
      )}
      {!showLoading && !error && works.length > 0 && visibleWorks.length === 0 && (
        <p className="px-4 py-6 text-center dark:text-white/70">
          {mediaFilters.size === 0 && statusFilters.size === 0
            ? "媒体と視聴ステータスを選択してください。"
            : mediaFilters.size === 0
              ? "媒体を選択してください。"
              : statusFilters.size === 0
                ? "視聴ステータスを選択してください。"
                : "この条件の作品はありません。"}
        </p>
      )}
      {!showLoading && !error && visibleWorks.length > 0 && (
        <p className="px-4 pt-1.5 pb-2 bg-annict-100/70 text-white text-center text-sm tabular-nums">
          {visibleWorks.length.toLocaleString("ja-JP")}件が見つかりました。
        </p>
      )}
      {visibleWorks.length > 0 && (
        <ul>
          {visibleWorks.map((work) => (
            <li key={work.annictId} className="border-b dark:border-stone-700">
              <AnimeWorkItem work={work} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
