import type { Setting, Category, DisplayId, Id } from "~/types/settings";

import Const from "~/constants";
import { canUseLocalStorage, getLocalStorageItem, setLocalStorageItem } from "~/libs/storage";

export const DEFAULT_ANIME_LIST_STATUSES = ["WATCHING", "WANNA_WATCH"] as const;

export const ALL_STATUS_STATE_IDS = Const.STATUS_STATE_LIST.map((state) => state.id);

/** 視聴中に出せるステータス（見た・視聴中止は候補外） */
export const ANIME_PAGE_STATUS_OPTIONS = Const.STATUS_STATE_LIST.filter(
  (state) => state.id !== "WATCHED" && state.id !== "STOP_WATCHING",
);

const ANIME_PAGE_ALLOWED_STATUSES = new Set(ANIME_PAGE_STATUS_OPTIONS.map((state) => state.id));

const displayChoices = [
  { id: "visible", label: "表示する" },
  { id: "record-after-visible", label: "評価後に表示する" },
  { id: "invisible", label: "非表示にする" },
];

export const displays: Record<DisplayId, { value: typeof displayChoices; default: string }> = {
  "episode-comments": {
    value: displayChoices,
    default: "visible",
  },
  "episode-evaluation": {
    value: displayChoices,
    default: "visible",
  },
  "work-comments": {
    value: displayChoices,
    default: "visible",
  },
  "work-evaluation": {
    value: displayChoices,
    default: "visible",
  },
};

function readSettings(): Setting {
  const storage = getLocalStorageItem(Const.STORAGE_SETTINGS);
  if (!storage) return {};

  try {
    const parsed = JSON.parse(storage) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as Setting;
  } catch {
    return {};
  }
}

function writeSettings(settings: Setting) {
  setLocalStorageItem(Const.STORAGE_SETTINGS, JSON.stringify(settings));
}

export function setSetting(category: Category, id: Id, newValue: unknown) {
  if (!canUseLocalStorage()) {
    return;
  }
  const settings = readSettings();
  settings[category] = {
    ...(settings[category] ?? {}),
    [id]: newValue,
  } as Setting[typeof category];
  writeSettings(settings);
}

export function getSetting(category: "displays", id: DisplayId) {
  if (!canUseLocalStorage()) {
    return displays[id].default;
  }
  const settings = readSettings();
  const value = settings[category]?.[id];
  if (value) {
    return value;
  }
  return displays[id].default;
}

export function getEpisodeRatingColor() {
  if (!canUseLocalStorage()) {
    return true;
  }
  const enabled = readSettings().episodeRatingColor;
  return enabled !== false;
}

export function setEpisodeRatingColor(enabled: boolean) {
  if (!canUseLocalStorage()) {
    return;
  }
  const settings = readSettings();
  settings.episodeRatingColor = enabled;
  writeSettings(settings);
}

export function getAnimeListStatuses(): string[] {
  if (!canUseLocalStorage()) {
    return [...DEFAULT_ANIME_LIST_STATUSES];
  }

  const settings = readSettings();
  const statuses = settings.anime?.statuses;
  if (Array.isArray(statuses) && statuses.length > 0) {
    const filtered = statuses.filter((status) => ANIME_PAGE_ALLOWED_STATUSES.has(status));
    if (filtered.length > 0) {
      return filtered;
    }
  }

  return [...DEFAULT_ANIME_LIST_STATUSES];
}

export function setAnimeListStatuses(statuses: string[]) {
  if (!canUseLocalStorage()) {
    return;
  }
  const next = Const.STATUS_STATE_LIST
    .map((state) => state.id)
    .filter((id) => statuses.includes(id) && ANIME_PAGE_ALLOWED_STATUSES.has(id));

  setSetting("anime", "statuses", next.length > 0 ? next : [...DEFAULT_ANIME_LIST_STATUSES]);
}
