import type { Metadata } from "next";

import { loadAnimeDetailPageData } from "~/features/apollo/loaders";
import { animeDetailTitle } from "~/libs/animeTitle";

type Params = {
  params: Promise<{ annictId: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const annictId = Number((await params).annictId);
  const data = Number.isInteger(annictId) ? await loadAnimeDetailPageData(annictId) : null;
  return { title: animeDetailTitle(data?.work) };
}

export default function RelatedWorksPage() {
  // Next.js はページ要素の位置までスクロールする。null だと視聴中の位置が残る。
  return <div className="h-0" />;
}
