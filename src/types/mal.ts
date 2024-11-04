export interface Mal {
  malAnimeId: string
  fetchDate: Date
  image: {
    url: string
    active: boolean | undefined
  }
  episodes: 0
}

export interface Jikan {
  images: {
    webp: {
      large_image_url: string
    }
  }
  episodes: 0
}