'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { NetworkStatus } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { viewerActivitiesGql } from '~/features/apollo/gql/query/viewerActivitiesGql';
import type {
  ActivityItem,
  ActivityMultipleRecord,
  ActivityRecord,
  ActivityReview,
  ActivityStatus,
  ViewerActivitiesData,
} from '~/features/apollo/gql/query/viewerActivitiesGql';

import { RecordLink } from '~/components/animes/AnimeEpisode';
import Icons from '~/components/icons/Icons';
import { RingSpinner } from '~/components/spinners/Spinner';
import DisplayDate from '~/components/dates/DisplayDate';

import Const from '~/constants';
import { wasEdited } from '~/libs/function';
import { useEpisodeRatings, writeEpisodeRating } from '~/libs/episodeRatings';
import { useEpisodeRatingColor } from '~/libs/useEpisodeRatingColor';
import type { RatingState } from '~/features/apollo/generated-types';

const ROW_CLASS = 'flex gap-2 px-4 pt-1 pb-1.25 border-b dark:border-stone-700 hover:bg-black/10 hover:dark:bg-white/20';

const REVIEW_RATINGS = [
  { key: 'ratingOverallState', label: '全体' },
  { key: 'ratingAnimationState', label: '映像' },
  { key: 'ratingCharacterState', label: 'キャラクター' },
  { key: 'ratingStoryState', label: 'ストーリー' },
  { key: 'ratingMusicState', label: '音楽' },
] as const;

function itemsOf(data: ViewerActivitiesData | undefined) {
  const items: ActivityItem[] = [];
  for (const edge of data?.viewer?.activities?.edges ?? []) {
    const item = edge?.item;
    if (!item) continue;
    if (item.__typename === 'Record' && !item.episode) continue;
    items.push(item);
  }
  return items;
}

function episodeNumber(number?: number | null) {
  return `#${String(number ?? '').padStart(2, '0')}`;
}

function currentStatusOf(state?: string | null) {
  if (!state || state === 'NO_STATE') {
    return { id: 'NO_STATE', color: 'dark:text-white/70 text-black/50' };
  }
  return Const.STATUS_STATE_LIST.find((item) => item.id === state) ?? null;
}

function StatusIcon({ state }: { state?: string | null }) {
  const status = currentStatusOf(state);
  if (!status) return null;
  return (
    <Icons
      id={`${status.id}_CURRENT`}
      type="status_state"
      className={`flex-none text-[1.25em] mt-[.075em] ${status.color}`}
    />
  );
}

function recordRatingsOf(data: ViewerActivitiesData | undefined) {
  const ratings: { episodeAnnictId: number; rating: RatingState }[] = [];
  const seen = new Set<number>();
  for (const edge of data?.viewer?.activities?.edges ?? []) {
    const item = edge?.item;
    if (item?.__typename !== 'Record' || !item.ratingState || !item.episode) continue;
    if (seen.has(item.episode.annictId)) continue;
    seen.add(item.episode.annictId);
    ratings.push({ episodeAnnictId: item.episode.annictId, rating: item.ratingState });
  }
  return ratings;
}

function RecordRow({ item, showRatingColor }: { item: ActivityRecord; showRatingColor: boolean }) {
  const episode = item.episode;
  const ratingState = showRatingColor
    ? Const.RATING_STATE_LIST.find((state) => state.id === item.ratingState)
    : undefined;
  return (
    <RecordLink
      className={ROW_CLASS}
      workAnnictId={episode.work.annictId}
      episodeAnnictId={episode.annictId}
    >
      <StatusIcon state={episode.work.viewerStatusState} />
      <p className="grow text-left">{episode.title || Const.EPISODE_TITLE_UNDEFINED}</p>
      <div className={`flex-none mt-[.1em] w-2/5 flex gap-2 text-left text-xs ${ratingState?.color ?? 'opacity-70'}`}>
        <span className="whitespace-nowrap">{episodeNumber(episode.number)}</span>
        <span>{episode.work.title}</span>
      </div>
    </RecordLink>
  );
}

function episodesOf(item: ActivityMultipleRecord) {
  const episodes = [];
  for (const node of item.records?.nodes ?? []) {
    if (node?.episode) episodes.push(node.episode);
  }
  episodes.sort((a, b) => (a.number ?? 0) - (b.number ?? 0));
  return episodes;
}

function MultipleRecordRow({ item }: { item: ActivityMultipleRecord }) {
  const episodes = episodesOf(item);
  return (
    <Link href={`/anime/${item.work.annictId}`} className="block px-4 py-3 border-b dark:border-stone-700 hover:bg-black/10 hover:dark:bg-white/20">
      <div className="flex gap-2 text-sm">
        <StatusIcon state={item.work.viewerStatusState} />
        <p className="grow text-left">{item.work.title}</p>
        <div className="flex-none mt-[.1em] w-2/5 opacity-70 text-left text-xs">一括記録</div>
      </div>
      {episodes.length > 0 && (
        <ul className="mt-2 grid gap-1 pl-7 text-xs opacity-70">
          {episodes.map((episode) => (
            <li key={episode.annictId}>
              <span className="whitespace-nowrap">{episodeNumber(episode.number)}</span>
              <span className="ml-2">{episode.title || Const.EPISODE_TITLE_UNDEFINED}</span>
            </li>
          ))}
          {item.records?.pageInfo.hasNextPage && <li>ほか</li>}
        </ul>
      )}
    </Link>
  );
}

function defaultReviewTitle(workTitle: string) {
  return `「${workTitle}」の記録`;
}

function ReviewRow({ item }: { item: ActivityReview }) {
  const title = item.title?.trim();
  const showTitle = Boolean(title && title !== defaultReviewTitle(item.work.title));
  const ratings = REVIEW_RATINGS.flatMap(({ key, label }) => {
    const state = Const.RATING_STATE_LIST.find((rating) => rating.id === item[key]);
    return state ? [{ key, label, state }] : [];
  });
  return (
    <Link href={`/anime/${item.work.annictId}/records`} className="block px-4 py-3 border-b dark:border-stone-700 hover:bg-black/10 hover:dark:bg-white/20">
      <div className="flex gap-2 text-sm">
        <StatusIcon state={item.work.viewerStatusState} />
        <p className="grow text-left">{item.work.title}</p>
        <div className="flex-none mt-[.1em] w-2/5 opacity-70 text-left text-xs">記録</div>
      </div>
      {showTitle && <p className="mt-2 text-sm">{title}</p>}
      {(ratings.length > 0 || item.createdAt) && (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
          {ratings.map(({ key, label, state }) => (
            <span key={key} className={`inline-flex items-center px-2 py-0.5 rounded-full ${state.bgColor} text-white dark:text-inherit`}>
              <Icons id={state.id} type="rating_state" className="text-sm mr-1" />
              {label}
            </span>
          ))}
          <span><DisplayDate date={item.createdAt} /></span>
          {wasEdited(item.createdAt, item.updatedAt) && (
            <span className="dark:text-white/70 text-xs"><DisplayDate date={item.updatedAt} /></span>
          )}
        </div>
      )}
      {item.body.trim() && <p className="mt-3 text-sm whitespace-pre-wrap">{item.body}</p>}
    </Link>
  );
}

function StatusRow({ item }: { item: ActivityStatus }) {
  const changedTo = Const.STATUS_STATE_LIST.find((state) => state.id === item.state);
  return (
    <Link href={`/anime/${item.work.annictId}`} className={ROW_CLASS}>
      <StatusIcon state={item.work.viewerStatusState} />
      <p className="grow text-left">{item.work.title}</p>
      {changedTo && (
        <div className="flex-none mt-[.1em] w-2/5 opacity-70 text-left text-xs">「{changedTo.label}」へ変更</div>
      )}
    </Link>
  );
}

function ActivityRow({ item, showRatingColor }: { item: ActivityItem; showRatingColor: boolean }) {
  switch (item.__typename) {
    case 'Record':
      return <RecordRow item={item} showRatingColor={showRatingColor} />;
    case 'MultipleRecord':
      return <MultipleRecordRow item={item} />;
    case 'Review':
      return <ReviewRow item={item} />;
    case 'Status':
      return <StatusRow item={item} />;
  }
}

export default function MyRecords() {
  const { data, loading, error, fetchMore, networkStatus } = useQuery(viewerActivitiesGql, {
    variables: { first: Const.PAGE_SIZE },
    notifyOnNetworkStatusChange: true,
  });
  const [moreError, setMoreError] = useState<string | null>(null);
  const [, setEpisodeRatings] = useEpisodeRatings();
  const showRatingColor = useEpisodeRatingColor();
  const items = itemsOf(data);
  const recordRatings = useMemo(() => recordRatingsOf(data), [data]);

  useEffect(() => {
    if (recordRatings.length === 0) return;
    setEpisodeRatings((current) => {
      let next = current;
      for (const { episodeAnnictId, rating } of recordRatings) {
        next = writeEpisodeRating(next, episodeAnnictId, rating);
      }
      return next;
    });
  }, [recordRatings, setEpisodeRatings]);
  const hasNextPage = data?.viewer?.activities?.pageInfo.hasNextPage ?? false;
  const loadingMore = networkStatus === NetworkStatus.fetchMore;
  const showLoading = loading && !loadingMore && items.length === 0;

  const loadMore = async () => {
    const endCursor = data?.viewer?.activities?.pageInfo.endCursor;
    if (!hasNextPage || !endCursor || loadingMore) return;
    setMoreError(null);
    try {
      await fetchMore({
        variables: { after: endCursor },
        updateQuery: (previous, { fetchMoreResult }) => {
          const incoming = fetchMoreResult.viewer?.activities;
          const previousActivities = previous.viewer?.activities;
          if (!incoming || !previous.viewer || !previousActivities) return fetchMoreResult;
          return {
            ...previous,
            viewer: {
              ...previous.viewer,
              activities: {
                ...incoming,
                edges: [...(previousActivities.edges ?? []), ...(incoming.edges ?? [])],
              },
            },
          };
        },
      });
    } catch (cause) {
      setMoreError(cause instanceof Error ? cause.message : '取得に失敗しました');
    }
  };

  return (
    <>
      {showLoading && <div className="mt-12 text-center text-5xl text-annict-100"><RingSpinner /></div>}
      {error && !items.length && <p className="p-4 text-red-500">{error.message}</p>}
      {items.length > 0 && (
        <div className="text-sm">
          {items.map((item) => (
            <ActivityRow key={`${item.__typename}-${item.annictId}`} item={item} showRatingColor={showRatingColor} />
          ))}
        </div>
      )}
      {!showLoading && !error && items.length === 0 && (
        <p className="px-4 py-6 text-center dark:text-white/70">履歴はありません。</p>
      )}
      {moreError && <p className="p-4 text-red-500">{moreError}</p>}
      {items.length > 0 && !error && (
        <div className="py-6 text-center">
          <p className="text-sm tabular-nums dark:text-white/70">{items.length.toLocaleString('ja-JP')}件表示中</p>
          {hasNextPage && (
            <button
              type="button"
              onClick={() => void loadMore()}
              disabled={loadingMore}
              className="flex items-center my-5 mx-auto pr-2 pl-4 pt-1 pb-1.5 border dark:border-stone-500 rounded-full"
            >
              <span>{loadingMore ? '読み込み中' : 'さらに表示'}</span>
              <Icons id="arrow_drop_down" type="navigation" className="text-[1.5em]" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
