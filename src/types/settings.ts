export interface Setting {
  displays?: {
    ["peoples-records"]?: string;
    evaluation?: string;
  };
  anime?: {
    statuses?: string[];
  };
}

export type Category = "displays" | "anime";
export type DisplayId = "evaluation" | "peoples-records";
export type AnimeId = "statuses";
export type Id = DisplayId | AnimeId;
