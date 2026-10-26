import Const from "~/constants";

const SEASON_ORDER = ["WINTER", "SPRING", "SUMMER", "AUTUMN"] as const;

const SEASON_BY_MONTH = [
  { months: [1, 2, 3], id: "WINTER" },
  { months: [4, 5, 6], id: "SPRING" },
  { months: [7, 8, 9], id: "SUMMER" },
  { months: [10, 11, 12], id: "AUTUMN" },
] as const;

type SeasonId = (typeof SEASON_ORDER)[number];

export type Season = {
  year: number;
  id: SeasonId;
  label: string;
  key: string;
};

function seasonFromIndex(year: number, index: number): Season {
  const length = SEASON_ORDER.length;
  const yearOffset = Math.floor(index / length);
  const normalized = ((index % length) + length) % length;
  const id = SEASON_ORDER[normalized];
  const resolvedYear = year + yearOffset;
  const name = Const.SEASON_LIST.find((season) => season.id === id)?.label ?? "";

  return {
    year: resolvedYear,
    id,
    label: `${resolvedYear}年${name}`,
    key: `${resolvedYear}-${id.toLowerCase()}`,
  };
}

/** Annict のシーズン。冬は 1–3 月、春は 4–6 月、夏は 7–9 月、秋は 10–12 月 */
export function currentSeason(date = new Date()): Season {
  const month = date.getMonth() + 1;
  const id = SEASON_BY_MONTH.find((season) => (season.months as readonly number[]).includes(month))?.id ?? "WINTER";
  return seasonFromIndex(date.getFullYear(), SEASON_ORDER.indexOf(id));
}

export function adjacentSeasons(date = new Date()) {
  const current = currentSeason(date);
  const index = SEASON_ORDER.indexOf(current.id);
  return {
    previous: seasonFromIndex(current.year, index - 1),
    current,
    next: seasonFromIndex(current.year, index + 1),
  };
}
