import type { Work } from "~/features/apollo/generated-types";

import Const from "~/constants";

export function animeDetailTitle(work: Work | null | undefined) {
  return work?.title || "詳細";
}

export function animeRecordTitle(work: Work | null | undefined, episodeAnnictId: number) {
  const workTitle = work?.title;
  if (!workTitle) {
    return "記録";
  }

  const episode = work.episodes?.nodes?.find((node) => node?.annictId === episodeAnnictId);
  const episodeLabel = episode?.numberText || Const.EPISODE_TITLE_UNDEFINED;
  return `${episodeLabel}｜${workTitle}`;
}
