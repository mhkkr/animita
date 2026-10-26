export const WORKS_SEASON_TABS = ["previous", "current", "next"] as const;

export type WorksSeasonTab = (typeof WORKS_SEASON_TABS)[number];

export function worksSeasonTabFromSegments(segments: string[] | undefined): WorksSeasonTab | null {
  if (!segments || segments.length === 0) return "current";
  if (segments.length === 1 && (segments[0] === "previous" || segments[0] === "next")) return segments[0];
  return null;
}

export function worksSeasonTabFromPathname(pathname: string): WorksSeasonTab | null {
  if (pathname === "/works") return "current";
  if (pathname === "/works/previous") return "previous";
  if (pathname === "/works/next") return "next";
  return null;
}

export function worksSeasonTabHref(tab: WorksSeasonTab) {
  if (tab === "current") return "/works";
  return `/works/${tab}`;
}
