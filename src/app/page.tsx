import LayoutContainer from "~/components/layouts/Container";
import AnimeList from "~/components/animes/AnimeList";
import { loadHomePageData } from "~/features/apollo/loaders";

import Const from "~/constants";

export const metadata = {
  title: "視聴可能",
  alternates: {
    canonical: Const.URL,
  },
};

export default async function Home() {
  const data = await loadHomePageData();

  return (
    <LayoutContainer>
      <AnimeList
        view="delivered"
        title="視聴可能"
        icon="play"
        initialEntries={data?.entries}
      />
    </LayoutContainer>
  );
}
