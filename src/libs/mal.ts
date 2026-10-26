import type { Mal, Jikan } from "~/types/mal";

import Const from "~/constants";
import { getLocalStorageItem, setLocalStorageItem } from "~/libs/storage";

function getStorage(): string | null {
  return getLocalStorageItem(Const.STORAGE_MAL);
}
function setStorage(mal: Mal[]) {
  setLocalStorageItem(Const.STORAGE_MAL, JSON.stringify(mal));
}

/** 取得日から1週間（7日）経過しているか */
function checkOldDate(fetchDate: Date): boolean {
  const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
  const now = new Date();
  const targetDate = typeof fetchDate === "string" ? new Date(fetchDate) : fetchDate;
    
  const difference = now.getTime() - targetDate.getTime();
    
  return difference >= oneWeekInMs;
}

function remove(malAnimeId: string, mal: Mal[]) {
  setStorage(mal.filter(m => m.malAnimeId !== malAnimeId));
}

function add(malAnimeId: string, mal: Mal[], data: Jikan, imageActive?: boolean) {
  const fetchDate = new Date();
  const image = {
    url: data.images.webp.large_image_url,
    active: imageActive
  };
  const episodes = data.episodes;
  mal.push({ malAnimeId, fetchDate, image, episodes });
  setStorage(mal);
}

function update(index: number, mal: Mal[], data: Jikan, imageActive?: boolean) {
  if (mal[index]) {
    mal[index].fetchDate = new Date();
    mal[index].image = {
      url: data.images.webp.large_image_url,
      active: imageActive === undefined ? mal[index].image.active : imageActive,
    };
    mal[index].episodes = data.episodes;
    setStorage(mal);
  }
}

export function targetMal(malAnimeId: string, mal: Mal[]): Mal | null {
  const m = mal.find(m => m.malAnimeId === malAnimeId);
  if (m) {
    if (checkOldDate(m.fetchDate)) {
      remove(malAnimeId, mal);
    } else {
      return m;
    }
  }
  return null;
}

export function getMal(): Mal[] {
  const mal = getStorage();
  if (!mal) return [];

  try {
    const parsed = JSON.parse(mal) as unknown;
    return Array.isArray(parsed) ? parsed as Mal[] : [];
  } catch {
    return [];
  }
}

export function setMal(malAnimeId: string, data: Jikan, imageActive?: boolean) {
  const mal = getMal();
  const index = mal.findIndex(m => m.malAnimeId === malAnimeId);
  if (index > -1) {
    update(index, mal, data, imageActive);
  } else {
    add(malAnimeId, mal, data, imageActive);
  }
}

/** 公開枠は毎秒4件・毎分120件。連続でも分枠を超えない間隔にする */
const REQUEST_INTERVAL_MS = 600;
const MAX_ATTEMPTS = 3;

const inflight = new Map<string, Promise<{ data: Jikan }>>();
let requestChain: Promise<void> = Promise.resolve();
let lastRequestAt = 0;

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function retryDelayMs(response: Response, attempt: number) {
  const seconds = Number(response.headers.get("Retry-After"));
  if (Number.isFinite(seconds) && seconds > 0) {
    return seconds * 1000;
  }
  return 1000 * (attempt + 1);
}

function scheduleRequest<T>(task: () => Promise<T>): Promise<T> {
  const run = requestChain.then(async () => {
    const pause = REQUEST_INTERVAL_MS - (Date.now() - lastRequestAt);
    if (pause > 0) {
      await wait(pause);
    }
    lastRequestAt = Date.now();
    return task();
  });
  requestChain = run.then(() => undefined, () => undefined);
  return run;
}

async function requestAnime(malAnimeId: string): Promise<{ data: Jikan }> {
  return scheduleRequest(async () => {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      const response = await fetch(`https://api.tenrai.org/v1/anime/${malAnimeId}`);
      if (response.status === 429 && attempt < MAX_ATTEMPTS) {
        await wait(retryDelayMs(response, attempt));
        lastRequestAt = Date.now();
        continue;
      }
      if (!response.ok) {
        throw new Error(`Tenrai API HTTP ${response.status}`);
      }
      return response.json() as Promise<{ data: Jikan }>;
    }
    throw new Error("Tenrai API HTTP 429");
  });
}

/**
 * MyAnimeList メタデータ取得。
 * Jikan 公開 API (api.jikan.moe) は 2026-10-01 に廃止されたため、
 * 同一スキーマの Tenrai (https://api.tenrai.org/v1) を利用する。
 * 一覧が同時に画像を取りに行くと 429 になるので、作品ごとに1回へまとめ、間隔を空ける。
 */
export function fetchJikanAnime(malAnimeId: string): Promise<{ data: Jikan }> {
  const current = inflight.get(malAnimeId);
  if (current) {
    return current;
  }

  const request = requestAnime(malAnimeId).finally(() => {
    inflight.delete(malAnimeId);
  });
  inflight.set(malAnimeId, request);
  return request;
}