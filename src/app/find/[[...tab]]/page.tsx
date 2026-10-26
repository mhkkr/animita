import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { findSeasonTabFromSegments } from "~/libs/findTab";

type Params = {
  params: Promise<{ tab?: string[] }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const tab = findSeasonTabFromSegments((await params).tab);
  if (!tab) return { title: "ページが見つかりません" };
  return { title: "見つける" };
}

export default async function FindPage({ params }: Params) {
  const tab = findSeasonTabFromSegments((await params).tab);
  if (!tab) notFound();

  // Next.js はページ要素の位置までスクロールする。null だと直前の位置が残る。
  return <div className="h-0" />;
}
