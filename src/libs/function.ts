export function generateDateStyle({ date }: { date: Date }) {
  if (!date) return 0;
  return date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + date.getMinutes();
}

export function getMutedUsers(): { annictId: number, username: string }[] {
  const mutedUsers = localStorage.getItem("mutedUsers");
  return mutedUsers ? JSON.parse(mutedUsers) : [];
}

export const fetchJikanAnime = async (malAnimeId: string): Promise<{
  data: {
    images: {
      jpg: {
        image_url: string,
        small_image_url: string,
        large_image_url: string
      },
      webp: {
        image_url: string,
        small_image_url: string,
        large_image_url: string
      }
    },
    episodes: 0,
  }
}> => {
  const response = await fetch(`https://api.jikan.moe/v4/anime/${malAnimeId}`)
  return response.json()
};