"use client";

import { useEffect, useMemo, useState } from "react";
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
import { findSeasonTabFromPathname, findSeasonTabHref } from "~/libs/findTab";
import { adjacentSeasons } from "~/libs/season";
import { DEFAULT_ANIME_LIST_STATUSES, getAnimeListStatuses } from "~/libs/settings";
import { streamServiceNames } from "~/libs/streams";

const SEASON_WORKS_LIMIT = 500;

const SEASON_TABS = [
  { id: "previous", label: "前期" },
  { id: "current", label: "今期" },
  { id: "next", label: "来期" },
] as const;

type SeasonTabId = (typeof SEASON_TABS)[number]["id"];

type MediaId = (typeof Const.MEDIA_FILTERS)[number]["id"];
type StreamFilterId = (typeof Const.STREAM_FILTERS)[number]["id"];

function isKnownStream(channelName: string) {
  return Const.STREAM_FILTERS.some((filter) => {
    if (filter.id === "OTHER") return false;
    if ("includes" in filter) return channelName.includes(filter.includes);
    return channelName === filter.id;
  });
}

function isStreamFilterId(value: string): value is StreamFilterId {
  return Const.STREAM_FILTERS.some((filter) => filter.id === value);
}

function matchesStream(names: readonly string[], filterId: StreamFilterId) {
  const filter = Const.STREAM_FILTERS.find((item) => item.id === filterId);
  if (!filter) return false;
  if (filter.id === "OTHER") return names.some((name) => !isKnownStream(name));
  if ("includes" in filter) return names.some((name) => name.includes(filter.includes));
  return names.includes(filter.id);
}

function byPopularity(a: SeasonWork, b: SeasonWork) {
  return b.watchersCount - a.watchersCount || b.reviewsCount - a.reviewsCount;
}

function hiddenStatusLabel(statuses: readonly string[]) {
  return Const.STATUS_STATE_LIST
    .filter((state) => statuses.includes(state.id))
    .map((state) => state.label)
    .join("・");
}

function isListedWork(work: SeasonWork, hiddenStatuses: readonly string[]) {
  if (!work.viewerStatusState || work.viewerStatusState === "NO_STATE") return true;
  return !hiddenStatuses.includes(work.viewerStatusState);
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

export default function AnimeFind() {
  const client = useApolloClient();
  const tab = findSeasonTabFromPathname(usePathname());
  const seasons = adjacentSeasons();
  const season = tab ? seasons[tab] : seasons.current;
  const [mediaFilters, setMediaFilters] = useState<Set<MediaId>>(() => new Set<MediaId>(["TV"]));
  const [streamFilter, setStreamFilter] = useState<StreamFilterId | null>(null);
  const [works, setWorks] = useState<SeasonWork[]>(() => readSeasonWorks(client, season.key) ?? []);
  const [hiddenStatuses, setHiddenStatuses] = useState<string[]>([...DEFAULT_ANIME_LIST_STATUSES]);
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
    setHiddenStatuses(getAnimeListStatuses());
  }, []);

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

  const streamsByWork = useMemo(() => {
    const names = new Map<number, string[]>();
    for (const work of works) names.set(work.annictId, streamServiceNames(work.programs));
    return names;
  }, [works]);

  const seasonWorks = works.filter((work) => isListedWork(work, hiddenStatuses));
  const visibleWorks = seasonWorks.filter((work) => {
    if (!mediaFilters.has(work.media)) return false;
    if (!streamFilter) return true;
    return matchesStream(streamsByWork.get(work.annictId) ?? [], streamFilter);
  });
  const showLoading = loading && works.length === 0;

  const toggleMedia = (id: MediaId) => {
    setMediaFilters((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectStream = (name: string) => {
    setStreamFilter(isStreamFilterId(name) ? name : null);
  };

  const excludedLabel = hiddenStatusLabel(hiddenStatuses);

  if (!tab) return null;

  return (
    <div className="relative">
      <header className="border-b dark:border-stone-700">
        <h1 className="flex items-center justify-center p-4 text-xl font-bold">
          <Icons id="explore" type="navigation" className="mr-2 text-[1.5em]" />
          <span>見つける</span>
        </h1>
        <p className="px-4 pb-4 -mt-2 text-center text-sm dark:text-white/70">
          {season.label}の作品の<em className="not-italic font-bold">「{excludedLabel}」</em>以外を人気順に表示します。<br />
          （<Link href="/mypage/setting" className="underline">マイページの設定</Link>の視聴中から変更可能）
        </p>
      </header>
      <div className="sticky top-0 z-10 border-b dark:border-stone-700 bg-white/60 dark:bg-black/60 backdrop-blur-md">
        <div role="tablist" aria-label="配信時期" className="flex border-b dark:border-stone-700">
          {SEASON_TABS.map((item) => {
            const selected = tab === item.id;
            return (
              <Link
                key={item.id}
                href={findSeasonTabHref(item.id)}
                role="tab"
                aria-selected={selected}
                className={`relative flex-1 px-2 py-2 text-center text-sm after:content-[''] after:block after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-0.5 after:bg-annict-100 after:rounded-full ${selected ? "font-bold" : "dark:text-white/70 after:hidden"}`}
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
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 p-4">
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
          <div className="flex min-w-48 flex-1 items-center gap-2">
            <label htmlFor="stream-filter" className="shrink-0 text-sm dark:text-white/70">配信先</label>
            <select
              id="stream-filter"
              className="min-w-0 flex-1 dark:bg-black border dark:border-stone-500 px-2 py-1 rounded text-sm"
              value={streamFilter ?? ""}
              onChange={(event) => selectStream(event.currentTarget.value)}
            >
              <option value="">すべて</option>
              {Const.STREAM_FILTERS.map((filter) => (
                <option key={filter.id} value={filter.id}>{filter.label}</option>
              ))}
            </select>
            {!error && (
              <p className="shrink-0 pl-1 text-sm tabular-nums dark:text-white/70">
                {showLoading ? "読込中" : `${visibleWorks.length.toLocaleString("ja-JP")}件`}
              </p>
            )}
          </div>
        </div>
      </div>

      {showLoading && (
        <div className="mt-12 text-center text-5xl text-annict-100"><RingSpinner /></div>
      )}
      {error && <p className="p-4 text-red-500">{error}</p>}
      {!showLoading && !error && seasonWorks.length === 0 && (
        <div className="px-4 pt-6 dark:text-white/70">
          <Icons id="unknow" type="notification" className="table mx-auto mb-4 text-2xl" />
          <p className="text-center">{season.label}で、{excludedLabel}以外の作品はありません。</p>
        </div>
      )}
      {!showLoading && !error && seasonWorks.length > 0 && visibleWorks.length === 0 && (
        <p className="px-4 py-6 text-center dark:text-white/70">
          {mediaFilters.size === 0
            ? "媒体を選択してください。"
            : streamFilter
              ? "この配信先の作品はありません。"
              : "この媒体の作品はありません。"}
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
