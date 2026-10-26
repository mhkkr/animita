"use client";

import { useEffect, useState } from "react";

import type { Media, SeasonName, StatusState } from "~/features/apollo/generated-types";

import { RingSpinner } from "~/components/spinners/Spinner";
import AnimeWorkItem from "~/components/animes/AnimeWorkItem";

type RelatedWork = {
  annictId: number;
  title: string;
  media: Media | null;
  seasonName: SeasonName | null;
  seasonYear: number | null;
  viewerStatusState: StatusState | null;
  malAnimeId: string | null;
  ogpUrl: string | null;
  watchersCount: number | null;
  reviewsCount: number | null;
  programs: {
    nodes?: Array<{
      channel: {
        name: string;
        channelGroup: { name: string };
      };
    } | null> | null;
  } | null;
};

type RelatedSeries = {
  name: string;
  works: RelatedWork[];
};

type RelatedCacheEntry = {
  series: RelatedSeries[];
  failed: boolean;
};

const relatedCache = new Map<number, RelatedCacheEntry>();
const relatedInflight = new Map<number, Promise<RelatedCacheEntry>>();

function loadRelatedWorks(annictId: number): Promise<RelatedCacheEntry> {
  const cached = relatedCache.get(annictId);
  if (cached) return Promise.resolve(cached);

  const pending = relatedInflight.get(annictId);
  if (pending) return pending;

  const request = fetch(`/api/related-works?annictId=${annictId}`)
    .then((response) => (response.ok ? response.json() as Promise<{ series?: RelatedSeries[] }> : null))
    .then((data): RelatedCacheEntry => {
      const entry = data
        ? { series: data.series ?? [], failed: false }
        : { series: [], failed: true };
      if (!entry.failed) relatedCache.set(annictId, entry);
      return entry;
    })
    .catch((): RelatedCacheEntry => ({ series: [], failed: true }))
    .finally(() => {
      relatedInflight.delete(annictId);
    });

  relatedInflight.set(annictId, request);
  return request;
}

export default function RelatedWorks({ annictId }: { annictId: number }) {
  const cached = relatedCache.get(annictId);
  const [series, setSeries] = useState<RelatedSeries[] | null>(cached?.series ?? null);
  const [failed, setFailed] = useState(cached?.failed ?? false);

  useEffect(() => {
    const cachedEntry = relatedCache.get(annictId);
    if (cachedEntry) {
      setSeries(cachedEntry.series);
      setFailed(cachedEntry.failed);
      return;
    }

    let active = true;
    loadRelatedWorks(annictId).then((entry) => {
      if (!active) return;
      setSeries(entry.series);
      setFailed(entry.failed);
    });

    return () => {
      active = false;
    };
  }, [annictId]);

  if (series === null) {
    return <div className="py-8 text-center text-5xl text-annict-100"><RingSpinner /></div>;
  }

  if (series.length === 0) {
    return (
      <p className="px-4 py-4 dark:text-white/70">
        {failed ? "関連作品を取得できませんでした。" : "関連作品はありません。"}
      </p>
    );
  }

  return (
    <div>
      {series.map((item) => (
        <section key={item.name} className="mt-6">
          <h3 className="px-4 pb-2 mb-2 font-bold border-b dark:border-stone-700">{item.name} シリーズ</h3>
          <ul>
            {item.works.map((work) => (
              <li key={work.annictId} className="border-b dark:border-stone-700">
                <AnimeWorkItem work={work} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
