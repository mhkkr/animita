import type { RatingState } from "~/features/apollo/generated-types";

const RATING_PRIORITY: Record<RatingState, number> = {
  GREAT: 4,
  GOOD: 3,
  AVERAGE: 2,
  BAD: 1,
};

export function compareByRating(
  a: { state?: RatingState | null; likesCount: number },
  b: { state?: RatingState | null; likesCount: number },
) {
  const ratingComparison = (b.state ? RATING_PRIORITY[b.state] : 0) - (a.state ? RATING_PRIORITY[a.state] : 0);
  if (ratingComparison !== 0) {
    return ratingComparison;
  }
  return b.likesCount - a.likesCount;
}
