export interface Setting {
  displays?: {
    ["peoples-records"]?: string;
    evaluation?: string;
    ["work-peoples-records"]?: string;
    ["work-evaluation"]?: string;
  };
  anime?: {
    statuses?: string[];
  };
}

export type Category = "displays" | "anime";
export type DisplayId = "evaluation" | "peoples-records" | "work-evaluation" | "work-peoples-records";
export type AnimeId = "statuses";
export type Id = DisplayId | AnimeId;
