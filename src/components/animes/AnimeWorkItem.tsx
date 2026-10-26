import Link from "next/link";

import type { Media, SeasonName, StatusState } from "~/features/apollo/generated-types";

import Icons from "~/components/icons/Icons";
import { MalThumb } from "~/components/animes/AnimeThumbnail";

import Const from "~/constants";
import { STREAM_SEPARATOR, streamServiceNames } from "~/libs/streams";

const MEDIA_LABEL = Const.MEDIA_FILTERS.reduce((labels, filter) => {
  labels[filter.id] = filter.label;
  return labels;
}, {} as Record<Media, string>);

type WorkPrograms = Parameters<typeof streamServiceNames>[0];

export type AnimeWorkItemData = {
  annictId: number;
  title: string;
  malAnimeId?: string | null;
  media?: Media | null;
  seasonYear?: number | null;
  seasonName?: SeasonName | null;
  watchersCount?: number | null;
  reviewsCount?: number | null;
  viewerStatusState?: StatusState | null;
  image?: {
    facebookOgImageUrl?: string | null;
  } | null;
  ogpUrl?: string | null;
  programs?: WorkPrograms;
};

function seasonLabel(work: AnimeWorkItemData) {
  const name = Const.SEASON_LIST.find((season) => season.id === work.seasonName)?.label;
  if (work.seasonYear && name) return `${work.seasonYear}年${name}`;
  if (work.seasonYear) return `${work.seasonYear}年`;
  return name ?? null;
}

function statusOf(state?: StatusState | null) {
  if (!state || state === "NO_STATE") {
    return { id: "NO_STATE", label: "未選択", color: "dark:text-white/70 text-black/50" };
  }
  return Const.STATUS_STATE_LIST.find((item) => item.id === state) ?? null;
}

export default function AnimeWorkItem({ work }: { work: AnimeWorkItemData }) {
  const season = seasonLabel(work);
  const streams = streamServiceNames(work.programs);
  const status = work.viewerStatusState === undefined ? null : statusOf(work.viewerStatusState);

  return (
    <Link href={`/anime/${work.annictId}`} className="flex gap-4 p-4 hover:bg-stone-500/30">
      <MalThumb
        malAnimeId={work.malAnimeId}
        ogpUrl={work.image?.facebookOgImageUrl ?? work.ogpUrl}
        title={work.title}
        lazy
        figureClassName="shrink-0 w-18 aspect-425/600 overflow-hidden bg-gray-400/70 text-gray-700/70 dark:bg-gray-700/70"
        spinnerClassName="text-3xl"
      />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap gap-x-2 text-xs dark:text-white/70">
          {work.media && <span>{MEDIA_LABEL[work.media]}</span>}
          {season && <span>{season}</span>}
          {typeof work.watchersCount === "number" && <span>視聴者 {work.watchersCount.toLocaleString("ja-JP")}</span>}
          {typeof work.reviewsCount === "number" && <span>評価 {work.reviewsCount.toLocaleString("ja-JP")}</span>}
        </p>
        <p className="mt-1 font-bold">{work.title}</p>
        {streams.length > 0 && (
          <p className="mt-1 text-xs dark:text-white/70">{streams.join(STREAM_SEPARATOR)}</p>
        )}
        {status && (
          <p className={`mt-1 flex items-center gap-0.5 text-xs ${status.color}`}>
            <Icons id={`${status.id}_CURRENT`} type="status_state" className="text-[1.25em]" aria-hidden="true" />
            {status.label}
          </p>
        )}
      </div>
    </Link>
  );
}
