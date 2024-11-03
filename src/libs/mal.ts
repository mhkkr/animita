import type { Mal, FetchMal } from '~/types/mal';

function checkOldDateMal(fetchDate: Date): boolean {
  const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
  const now = new Date();
  const targetDate = typeof fetchDate === "string" ? new Date(fetchDate) : fetchDate;
    
  const difference = now.getTime() - targetDate.getTime();
    
  return difference >= oneWeekInMs;
}

function removeMal(mal: Mal[], malAnimeId: string) {
  const newMal = mal.filter(m => m.malAnimeId !== malAnimeId);
  localStorage.setItem("mal", JSON.stringify(newMal));
}

export function targetMal(mal: Mal[], malAnimeId: string): Mal | null {
  const m = mal.find(m => m.malAnimeId === malAnimeId);

  if (m) {
    if (checkOldDateMal(m.fetchDate)) {
      removeMal(mal, malAnimeId);
    } else {
      return m;
    }
  }

  return null;
}

export function getMal(): Mal[] {
  const mal = localStorage.getItem("mal");
  return mal ? JSON.parse(mal) : [];
}

export function setMal(malAnimeId: string, data: FetchMal) {
  const mal = getMal();
  if (!mal.some(m => m.malAnimeId === malAnimeId)) {
    const fetchDate = new Date();
    const largeImageUrl = data.images.webp.large_image_url;
    const episodes = data.episodes;
    mal.push({ malAnimeId, fetchDate, largeImageUrl, episodes });
    localStorage.setItem("mal", JSON.stringify(mal));
  }
}

export const fetchJikanAnime = async (malAnimeId: string): Promise<{data: FetchMal}> => {
  const response = await fetch(`https://api.jikan.moe/v4/anime/${malAnimeId}`)
  return response.json()
};