"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NetworkStatus } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

import {
  libraryStatusWorksGql,
  type LibraryStatusWorksQuery,
  type LibraryWork,
} from "~/features/apollo/gql/query/libraryStatusWorksGql";
import { libraryStatusState, libraryTabFromPathname, libraryTabHref } from "~/libs/libraryTab";

import Icons from "~/components/icons/Icons";
import { RingSpinner } from "~/components/spinners/Spinner";
import AnimeWorkItem from "~/components/animes/AnimeWorkItem";

import Const from "~/constants";

function worksOf(data: LibraryStatusWorksQuery | undefined) {
  const works: LibraryWork[] = [];
  for (const node of data?.viewer?.libraryEntries?.nodes ?? []) {
    if (node?.work) works.push(node.work);
  }
  return works;
}

export default function AnimeLibrary() {
  const pathname = usePathname();
  const tabId = libraryTabFromPathname(pathname);
  const tab = Const.STATUS_STATE_LIST.find((item) => item.id === tabId);
  const { data, loading, error, fetchMore, networkStatus } = useQuery(libraryStatusWorksGql, {
    variables: { states: [libraryStatusState(tab?.id ?? Const.STATUS_STATE_LIST[0].id)], first: Const.PAGE_SIZE },
    skip: !tab,
    notifyOnNetworkStatusChange: true,
  });
  const [moreError, setMoreError] = useState<string | null>(null);
  const works = worksOf(data);

  useEffect(() => {
    setMoreError(null);
  }, [tab?.id]);
  const hasNextPage = data?.viewer?.libraryEntries?.pageInfo.hasNextPage ?? false;
  const loadingMore = networkStatus === NetworkStatus.fetchMore;
  const showLoading = loading && !loadingMore && works.length === 0;

  if (!tab) return null;

  const loadMore = async () => {
    const endCursor = data?.viewer?.libraryEntries?.pageInfo.endCursor;
    if (!hasNextPage || !endCursor || loadingMore) return;
    setMoreError(null);
    try {
      await fetchMore({
        variables: { after: endCursor },
        updateQuery: (previous, { fetchMoreResult }) => {
          const incoming = fetchMoreResult.viewer?.libraryEntries;
          const previousEntries = previous.viewer?.libraryEntries;
          if (!incoming || !previous.viewer || !previousEntries) return fetchMoreResult;
          return {
            ...previous,
            viewer: {
              ...previous.viewer,
              libraryEntries: {
                ...incoming,
                nodes: [...(previousEntries.nodes ?? []), ...(incoming.nodes ?? [])],
              },
            },
          };
        },
      });
    } catch (cause) {
      setMoreError(cause instanceof Error ? cause.message : "取得に失敗しました");
    }
  };

  return (
    <div className="relative">
      <header className="border-b dark:border-stone-700">
        <h1 className="flex items-center justify-center p-4 text-xl font-bold">
          <Icons id="library" type="navigation" className="mr-2 text-[1.5em]" />
          <span>ライブラリ</span>
        </h1>
      </header>
      <div role="tablist" aria-label="視聴ステータス" className="sticky top-0 z-10 flex border-b dark:border-white/25 bg-white/60 dark:bg-black/60 backdrop-blur-md">
        {Const.STATUS_STATE_LIST.map((item) => {
          const selected = item.id === tab.id;
          return (
            <Link
              key={item.id}
              href={libraryTabHref(item.id)}
              role="tab"
              aria-selected={selected}
              className={`relative flex-1 px-1 py-3 text-center text-xs sm:text-sm whitespace-nowrap after:content-[''] after:block after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-1 after:bg-annict-100 after:rounded-full ${selected ? "font-bold" : "dark:text-white/70 after:hidden"}`}
              onClick={(event) => {
                if (selected) event.preventDefault();
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {showLoading && <div className="mt-12 text-center text-5xl text-annict-100"><RingSpinner /></div>}
      {error && works.length === 0 && <p className="p-4 text-red-500">{error.message}</p>}
      {!showLoading && !error && works.length === 0 && (
        <p className="px-4 py-6 text-center dark:text-white/70">{tab.label}の作品はありません。</p>
      )}
      {works.length > 0 && (
        <ul>
          {works.map((work) => (
            <li key={work.annictId} className="border-b dark:border-stone-700">
              <AnimeWorkItem work={work} showStatus={false} />
            </li>
          ))}
        </ul>
      )}
      {moreError && <p className="p-4 text-red-500">{moreError}</p>}
      {works.length > 0 && !error && (
        <div className="py-6 text-center">
          <p className="text-sm tabular-nums dark:text-white/70">{works.length.toLocaleString("ja-JP")}件表示中</p>
          {hasNextPage && (
            <button
              type="button"
              onClick={() => void loadMore()}
              disabled={loadingMore}
              className="flex items-center my-5 mx-auto pr-2 pl-4 pt-1 pb-1.5 border dark:border-stone-500 rounded-full"
            >
              <span>{loadingMore ? "読込中" : "さらに表示"}</span>
              <Icons id="arrow_drop_down" type="navigation" className="text-[1.5em]" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
