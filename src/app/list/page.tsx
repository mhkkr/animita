import AnimeListPage from "~/components/animes/AnimeListPage";

export const metadata = {
  title: "視聴中",
};

export default function ListPage() {
  return <AnimeListPage view="all" title="視聴中" icon="calendar" />;
}
