import type { DisplayId } from "~/types/settings";

import Const from "~/constants";
import { ANIME_PAGE_STATUS_OPTIONS, displays } from "~/libs/settings";
import { canUseLocalStorage, getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem } from "~/libs/storage";

/** 接頭辞を付ける前のキー。値は animita- 付きへ移してから消す */
const UNPREFIXED_STORAGE_KEYS = ["mal", "mutedUsers", "settings", "episodeRatings"] as const;

const DISPLAY_IDS = Object.keys(displays) as DisplayId[];
const STATUS_IDS = ANIME_PAGE_STATUS_OPTIONS.map((state) => state.id);

type StoredSettings = {
  displays?: Partial<Record<DisplayId, string>>;
  anime?: {
    statuses?: string[];
  };
};

function moveToPrefixedKeys() {
  for (const key of UNPREFIXED_STORAGE_KEYS) {
    const previous = getLocalStorageItem(key);
    if (previous === null) {
      continue;
    }

    const nextKey = `animita-${key}`;
    if (getLocalStorageItem(nextKey) === null) {
      setLocalStorageItem(nextKey, previous);
    }
    removeLocalStorageItem(key);
  }
}

export function migrateLocalStorage() {
  if (!canUseLocalStorage()) {
    return;
  }

  moveToPrefixedKeys();

  const raw = getLocalStorageItem(Const.STORAGE_SETTINGS);
  if (!raw) {
    return;
  }

  let settings: unknown;
  try {
    settings = JSON.parse(raw);
  } catch {
    return;
  }

  const next = keepCurrentSettings(settings);
  if (JSON.stringify(next) === JSON.stringify(settings)) {
    return;
  }

  if (!next.displays && !next.anime) {
    removeLocalStorageItem(Const.STORAGE_SETTINGS);
    return;
  }

  setLocalStorageItem(Const.STORAGE_SETTINGS, JSON.stringify(next));
}

function keepCurrentSettings(input: unknown): StoredSettings {
  if (!input || typeof input !== "object") {
    return {};
  }

  const source = input as Record<string, unknown>;
  const next: StoredSettings = {};

  const rawDisplays = source.displays;
  if (rawDisplays && typeof rawDisplays === "object") {
    const kept: Partial<Record<DisplayId, string>> = {};
    for (const id of DISPLAY_IDS) {
      const value = (rawDisplays as Record<string, unknown>)[id];
      if (typeof value === "string" && displays[id].value.some((choice) => choice.id === value)) {
        kept[id] = value;
      }
    }
    if (Object.keys(kept).length > 0) {
      next.displays = kept;
    }
  }

  const rawAnime = source.anime;
  if (rawAnime && typeof rawAnime === "object") {
    const statuses = (rawAnime as { statuses?: unknown }).statuses;
    if (Array.isArray(statuses)) {
      const kept = STATUS_IDS.filter((id) => statuses.includes(id));
      if (kept.length > 0) {
        next.anime = { statuses: kept };
      }
    }
  }

  return next;
}
