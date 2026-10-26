"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ApolloClient } from "@apollo/client";
import { useApolloClient } from "@apollo/client/react";

import {
  searchWorksByTitleGql,
  type SearchWorksByTitleQuery,
  type TitleSearchWork,
} from "~/features/apollo/gql/query/searchWorksByTitleGql";

import Icons from "~/components/icons/Icons";
import { RingSpinner } from "~/components/spinners/Spinner";
import AnimeWorkItem from "~/components/animes/AnimeWorkItem";

import Const from "~/constants";

function worksOf(connection: SearchWorksByTitleQuery["searchWorks"]) {
  const works: TitleSearchWork[] = [];
  for (const node of connection?.nodes ?? []) {
    if (node) works.push(node);
  }
  return works;
}

function readTitleSearch(client: ApolloClient, query: string) {
  try {
    const data = client.readQuery({
      query: searchWorksByTitleGql,
      variables: { titles: [query], first: Const.PAGE_SIZE },
    });
    if (!data?.searchWorks) return null;
    return {
      works: worksOf(data.searchWorks),
      hasNextPage: data.searchWorks.pageInfo.hasNextPage,
      endCursor: data.searchWorks.pageInfo.endCursor ?? null,
    };
  } catch {
    return null;
  }
}

export default function AnimeSearch() {
  const client = useApolloClient();
  const router = useRouter();
  const params = useSearchParams();
  const query = params.get("q")?.trim() ?? "";
  const initialSearch = query ? readTitleSearch(client, query) : null;
  const [draft, setDraft] = useState(query);
  const [works, setWorks] = useState<TitleSearchWork[]>(initialSearch?.works ?? []);
  const [endCursor, setEndCursor] = useState<string | null>(initialSearch?.endCursor ?? null);
  const [hasNextPage, setHasNextPage] = useState(initialSearch?.hasNextPage ?? false);
  const [loading, setLoading] = useState(Boolean(query));
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedQuery, setLoadedQuery] = useState(query);
  const searchGeneration = useRef(0);

  if (loadedQuery !== query) {
    const cached = query ? readTitleSearch(client, query) : null;
    setLoadedQuery(query);
    setDraft(query);
    setWorks(cached?.works ?? []);
    setEndCursor(cached?.endCursor ?? null);
    setHasNextPage(cached?.hasNextPage ?? false);
    setLoading(Boolean(query));
    setLoadingMore(false);
    setError(null);
  }

  useEffect(() => {
    setDraft(query);
  }, [query]);

  useEffect(() => {
    if (!query) {
      setWorks([]);
      setEndCursor(null);
      setHasNextPage(false);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    const generation = searchGeneration.current + 1;
    searchGeneration.current = generation;
    const cached = readTitleSearch(client, query);
    if (cached) {
      setWorks(cached.works);
      setHasNextPage(cached.hasNextPage);
      setEndCursor(cached.endCursor);
      setError(null);
    } else {
      setWorks([]);
      setEndCursor(null);
      setHasNextPage(false);
    }
    setLoading(true);

    async function load() {
      try {
        const result = await client.query({
          query: searchWorksByTitleGql,
          variables: { titles: [query], first: Const.PAGE_SIZE },
          fetchPolicy: "network-only",
        });
        if (cancelled || generation !== searchGeneration.current) return;
        if (result.error) throw result.error;

        const connection = result.data?.searchWorks;
        setWorks(worksOf(connection));
        setHasNextPage(connection?.pageInfo.hasNextPage ?? false);
        setEndCursor(connection?.pageInfo.endCursor ?? null);
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
  }, [client, query]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = draft.trim();
    if (next === query) return;
    router.push(next ? `/search?q=${encodeURIComponent(next)}` : "/search");
  };

  const loadMore = async () => {
    if (!query || !hasNextPage || !endCursor || loadingMore) return;
    const requested = query;
    const generation = searchGeneration.current;
    setLoadingMore(true);
    try {
      const result = await client.query({
        query: searchWorksByTitleGql,
        variables: { titles: [requested], first: Const.PAGE_SIZE, after: endCursor },
        fetchPolicy: "network-only",
      });
      if (generation !== searchGeneration.current) return;
      if (result.error) throw result.error;
      const connection = result.data?.searchWorks;
      setWorks((current) => current.concat(worksOf(connection)));
      setHasNextPage(connection?.pageInfo.hasNextPage ?? false);
      setEndCursor(connection?.pageInfo.endCursor ?? null);
    } catch (cause) {
      if (generation !== searchGeneration.current) return;
      setError(cause instanceof Error ? cause.message : "取得に失敗しました");
    } finally {
      if (generation === searchGeneration.current) setLoadingMore(false);
    }
  };

  const showLoading = loading && works.length === 0;

  return (
    <div className="relative">
      <header className="border-b dark:border-stone-700">
        <h1 className="flex items-center justify-center p-4 text-xl font-bold">
          <Icons id="search" type="navigation" className="mr-2 text-[1.5em]" />
          <span>検索</span>
        </h1>
      </header>
      <form
        onSubmit={submit}
        className="sticky top-0 z-10 flex items-center gap-2 border-b dark:border-stone-700 bg-white/60 dark:bg-black/60 backdrop-blur-md p-4"
      >
        <label htmlFor="anime-search" className="sr-only">キーワード</label>
        <input
          id="anime-search"
          type="search"
          value={draft}
          onChange={(event) => setDraft(event.currentTarget.value)}
          placeholder="作品名"
          autoFocus
          className="min-w-0 flex-1 dark:bg-black border dark:border-stone-500 px-2 py-1.5 rounded text-sm"
        />
        <button type="submit" className="shrink-0 inline-flex items-center justify-center size-9 rounded text-annict-100" aria-label="検索">
          <Icons id="search" type="navigation" className="text-[1.5em]" />
        </button>
      </form>

      {!query && (
        <p className="px-4 py-6 text-center dark:text-white/70">作品名で検索できます。</p>
      )}
      {showLoading && (
        <div className="mt-12 text-center text-5xl text-annict-100"><RingSpinner /></div>
      )}
      {error && <p className="p-4 text-red-500">{error}</p>}
      {query && !showLoading && !error && works.length === 0 && (
        <div className="px-4 pt-6 dark:text-white/70">
          <Icons id="unknow" type="notification" className="table mx-auto mb-4 text-2xl" />
          <p className="text-center">該当する作品はありません。</p>
        </div>
      )}
      {works.length > 0 && (
        <ul>
          {works.map((work) => (
            <li key={work.annictId} className="border-b dark:border-stone-700">
              <AnimeWorkItem work={work} />
            </li>
          ))}
        </ul>
      )}
      {works.length > 0 && !error && (
        <div className="py-6 text-center">
          <p className="text-sm tabular-nums dark:text-white/70">{works.length.toLocaleString("ja-JP")}件表示中</p>
          {hasNextPage && !loading && (
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="flex items-center my-5 mx-auto pr-2 pl-4 pt-1 pb-1.5 border dark:border-stone-500 rounded-full"
            >
              <span>{loadingMore ? "読み込み中" : "さらに表示"}</span>
              <Icons id="arrow_drop_down" type="navigation" className="text-[1.5em]" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
