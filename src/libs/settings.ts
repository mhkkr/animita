import type { Setting, Category, DisplayId, Id } from "~/types/settings";

import Const from "~/constants";
import { canUseLocalStorage, getLocalStorageItem, setLocalStorageItem } from "~/libs/storage";

export const DEFAULT_ANIME_LIST_STATUSES = ["WATCHING", "WANNA_WATCH"] as const;

export const displays = {
  ["peoples-records"]: {
    value: [
      { id: "invisible", label: "非表示にする" },
      { id: "record-after-visible", label: "評価するまで非表示にする" },
      { id: "visible", label: "表示する" },
    ],
    default: "visible",
  },
  evaluation: {
    value: [
      { id: "invisible", label: "非表示にする" },
      { id: "record-after-visible", label: "評価するまで非表示にする" },
      { id: "visible", label: "表示する" },
    ],
    default: "visible",
  },
};

function readSettings(): Setting {
  const storage = getLocalStorageItem(Const.STORAGE_SETTINGS);
  return storage ? JSON.parse(storage) as Setting : {};
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

const ANIME_PAGE_ALLOWED_STATUSES = new Set(
  Const.STATUS_STATE_LIST
    .map((state) => state.id)
    .filter((id) => id !== "WATCHED" && id !== "STOP_WATCHING"),
);

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

export function isDefaultAnimeListStatuses(statuses: string[]) {
  if (statuses.length !== DEFAULT_ANIME_LIST_STATUSES.length) {
    return false;
  }
  return DEFAULT_ANIME_LIST_STATUSES.every((status) => statuses.includes(status));
}
