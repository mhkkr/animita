import AnimeListPage from "~/components/animes/AnimeListPage";

export const metadata = {
  title: "週間予定",
};

export default function ListPage() {
  return <AnimeListPage view="all" title="週間予定" icon="calendar" />;
}
