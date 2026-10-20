import LayoutContainer from "~/components/layouts/Container";
import AnimeList, { type AnimeListView } from "~/components/animes/AnimeList";
import { loadAnimeListPageData } from "~/features/apollo/loaders";

type AnimeListPageProps = {
  view: AnimeListView;
  title: string;
  icon: string;
};

export default async function AnimeListPage({ view, title, icon }: AnimeListPageProps) {
  const data = await loadAnimeListPageData();

  return (
    <LayoutContainer>
      <AnimeList
        view={view}
        title={title}
        icon={icon}
        initialEntries={data?.entries}
      />
    </LayoutContainer>
  );
}
