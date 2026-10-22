import type { Metadata } from "next";

import { loadAnimeDetailPageData } from "~/features/apollo/loaders";
import { animeRecordTitle } from "~/libs/animeTitle";

type Params = {
  params: Promise<{ annictId: string; episodeAnnictId: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { annictId, episodeAnnictId } = await params;
  const workId = Number(annictId);
  const episodeId = Number(episodeAnnictId);
  const data = Number.isInteger(workId) ? await loadAnimeDetailPageData(workId) : null;
  return {
    title: animeRecordTitle(data?.work, Number.isInteger(episodeId) ? episodeId : 0),
  };
}

export default function EpisodeRecordPage() {
  // Next.js はページ要素の位置までスクロールする。null だと視聴中の位置が残る。
  return <div className="h-0" />;
}
