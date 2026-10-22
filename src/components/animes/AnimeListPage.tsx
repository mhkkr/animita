import LayoutContainer from "~/components/layouts/Container";
import AnimeList from "~/components/animes/AnimeList";

type AnimeListPageProps = {
  title: string;
  icon: string;
};

/** シェルだけ先に描画し、一覧データはクライアントで取得する */
export default function AnimeListPage({ title, icon }: AnimeListPageProps) {
  return (
    <LayoutContainer>
      <AnimeList title={title} icon={icon} />
    </LayoutContainer>
  );
}
