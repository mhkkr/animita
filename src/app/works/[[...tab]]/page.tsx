import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { worksSeasonTabFromSegments } from "~/libs/worksTab";

type Params = {
  params: Promise<{ tab?: string[] }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const tab = worksSeasonTabFromSegments((await params).tab);
  if (!tab) return { title: "ページが見つかりません" };
  return { title: "見つける" };
}

export default async function WorksPage({ params }: Params) {
  const tab = worksSeasonTabFromSegments((await params).tab);
  if (!tab) notFound();

  // Next.js はページ要素の位置までスクロールする。null だと直前の位置が残る。
  return <div className="h-0" />;
}
