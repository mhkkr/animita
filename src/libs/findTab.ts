export const FIND_SEASON_TABS = ["previous", "current", "next"] as const;

export type FindSeasonTab = (typeof FIND_SEASON_TABS)[number];

export function findSeasonTabFromSegments(segments: string[] | undefined): FindSeasonTab | null {
  if (!segments || segments.length === 0) return "current";
  if (segments.length === 1 && (segments[0] === "previous" || segments[0] === "next")) return segments[0];
  return null;
}

export function findSeasonTabFromPathname(pathname: string): FindSeasonTab | null {
  if (pathname === "/find") return "current";
  if (pathname === "/find/previous") return "previous";
  if (pathname === "/find/next") return "next";
  return null;
}

export function findSeasonTabHref(tab: FindSeasonTab) {
  if (tab === "current") return "/find";
  return `/find/${tab}`;
}
