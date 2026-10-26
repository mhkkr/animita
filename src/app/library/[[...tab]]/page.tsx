import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import Const from "~/constants";
import { libraryTabFromSegments, libraryTabHref } from "~/libs/libraryTab";

type Params = {
  params: Promise<{ tab?: string[] }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const segments = (await params).tab;
  if (segments && segments.length > 0 && !libraryTabFromSegments(segments)) {
    return { title: "ページが見つかりません" };
  }
  return { title: "ライブラリ" };
}

export default async function LibraryPage({ params }: Params) {
  const segments = (await params).tab;
  if (!segments || segments.length === 0) {
    redirect(libraryTabHref(Const.STATUS_STATE_LIST[0].id));
  }
  const tab = libraryTabFromSegments(segments);
  if (!tab) notFound();

  return <div className="h-0" />;
}
