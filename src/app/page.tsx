import LayoutContainer from "~/components/layouts/Container";
import AnimeList from "~/components/animes/AnimeList";
import { loadHomePageData } from "~/features/apollo/loaders";

import Const from "~/constants";

export const metadata = {
  alternates: {
    canonical: Const.URL,
  },
};

export default async function Home() {
  const data = await loadHomePageData();

  return (
    <LayoutContainer>
      <AnimeList
        initialEntriesByState={data?.entriesByState}
        initialUser={data?.user}
      />
    </LayoutContainer>
  );
}
