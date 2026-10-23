import type { Metadata } from "next";

import AnimeListPage from "~/components/animes/AnimeListPage";

import Const from "~/constants";

export const metadata: Metadata = {
  title: {
    absolute: `視聴中｜${Const.TITLE}`,
  },
  alternates: {
    canonical: Const.URL,
  },
};

export default function Home() {
  return <AnimeListPage title="視聴中" icon="tv" />;
}
