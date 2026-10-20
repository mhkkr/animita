import LayoutContainer from "~/components/layouts/Container";
import AnimeList, { type AnimeListView } from "~/components/animes/AnimeList";

type AnimeListPageProps = {
  view: AnimeListView;
  title: string;
  icon: string;
};

/** シェルだけ先に描画し、一覧データはクライアントで取得する */
export default function AnimeListPage({ view, title, icon }: AnimeListPageProps) {
  return (
    <LayoutContainer>
      <AnimeList view={view} title={title} icon={icon} />
    </LayoutContainer>
  );
}
