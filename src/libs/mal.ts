import type { Mal, Jikan } from '~/types/mal';

import Const from '~/constants';

function getStorage(): string | null {
  return localStorage.getItem(Const.STORAGE_MAL);
}
function setStorage(mal: Mal[]) {
  localStorage.setItem(Const.STORAGE_MAL, JSON.stringify(mal));
}

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
      active: imageActive
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
  return mal ? JSON.parse(mal) : [];
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

export const fetchJikanAnime = async (malAnimeId: string): Promise<{data: Jikan}> => {
  const response = await fetch(`https://api.jikan.moe/v4/anime/${malAnimeId}`)
  return response.json()
};