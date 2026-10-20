import LayoutContainer from "~/components/layouts/Container";
import AnimeList from "~/components/animes/AnimeList";
import { loadHomePageData } from "~/features/apollo/loaders";

export const metadata = {
  title: "視聴中",
};

export default async function ListPage() {
  const data = await loadHomePageData();

  return (
    <LayoutContainer>
      <AnimeList
        view="all"
        title="視聴中"
        icon="calendar"
        initialEntries={data?.entries}
      />
    </LayoutContainer>
  );
}
