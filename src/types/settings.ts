export interface Setting {
  displays?: {
    ["episode-comments"]?: string;
    ["episode-evaluation"]?: string;
    ["work-comments"]?: string;
    ["work-evaluation"]?: string;
  };
  anime?: {
    statuses?: string[];
  };
  episodeRatingColor?: boolean;
}

export type Category = "displays" | "anime";
export type DisplayId = "episode-comments" | "episode-evaluation" | "work-comments" | "work-evaluation";
type AnimeId = "statuses";
export type Id = DisplayId | AnimeId;
