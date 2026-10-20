import AnimeListPage from "~/components/animes/AnimeListPage";

import Const from "~/constants";

export const metadata = {
  title: "視聴可能",
  alternates: {
    canonical: Const.URL,
  },
};

export default function Home() {
  return <AnimeListPage view="delivered" title="視聴可能" icon="play" />;
}
