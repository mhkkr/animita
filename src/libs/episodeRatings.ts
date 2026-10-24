"use client";

import { useEffect } from "react";
import { atom, useAtom } from "jotai";
import type { RatingState } from "~/features/apollo/generated-types";

import Const from "~/constants";
import { getLocalStorageItem, setLocalStorageItem } from "~/libs/storage";

export type EpisodeRatingStore = Record<string, RatingState>;

type RatingRecord = {
  id?: string | null;
  user?: { annictId?: number | null } | null;
  ratingState?: RatingState | null;
} | null;

const ratingIds = new Set(Const.RATING_STATE_LIST.map((state) => state.id));

export const episodeRatingsAtom = atom<EpisodeRatingStore>({});

let loaded = false;

function isRatingState(value: string): value is RatingState {
  return ratingIds.has(value as RatingState);
}

export function readEpisodeRatings(): EpisodeRatingStore {
  const raw = getLocalStorageItem(Const.STORAGE_EPISODE_RATINGS);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const store: EpisodeRatingStore = {};
    for (const [id, rating] of Object.entries(parsed)) {
      if (typeof rating === "string" && isRatingState(rating)) {
        store[id] = rating;
      }
    }
    return store;
  } catch {
    return {};
  }
}

export function writeEpisodeRating(
  current: EpisodeRatingStore,
  episodeAnnictId: number,
  rating: RatingState | null,
): EpisodeRatingStore {
  const next = { ...readEpisodeRatings(), ...current };
  const key = String(episodeAnnictId);
  if (rating) {
    next[key] = rating;
  } else {
    delete next[key];
  }
  setLocalStorageItem(Const.STORAGE_EPISODE_RATINGS, JSON.stringify(next));
  return next;
}

/** 送信した評価を優先し、外したときは同じ話の別記録に残っている評価を使う */
export function resolveEpisodeRating(
  records: readonly RatingRecord[] | null | undefined,
  viewerAnnictId: number | null | undefined,
  submitted: RatingState | "" | null | undefined,
  excludeRecordId?: string,
): RatingState | null {
  if (submitted) return submitted;
  const other = records?.find(
    (record) =>
      record &&
      record.id !== excludeRecordId &&
      record.user?.annictId === viewerAnnictId &&
      record.ratingState,
  );
  return other?.ratingState ?? null;
}

export function useEpisodeRatings() {
  const [ratings, setRatings] = useAtom(episodeRatingsAtom);

  useEffect(() => {
    if (loaded) return;
    loaded = true;
    setRatings((current) => ({ ...readEpisodeRatings(), ...current }));
  }, [setRatings]);

  return [ratings, setRatings] as const;
}
