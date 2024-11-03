export interface Mal {
  malAnimeId: string
  fetchDate: Date
  largeImageUrl: string
  episodes: 0
}

export interface FetchMal {
  images: {
    webp: {
      image_url: string,
      small_image_url: string,
      large_image_url: string
    }
  }
  episodes: 0
}