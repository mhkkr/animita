import { loadAnimeDetailPageData } from "~/features/apollo/loaders";
import { RecordModal } from "~/components/animes/AnimeEpisode";

export default async function AnimeRecordRoute({
  annictId,
  episodeAnnictId,
}: {
  annictId: number;
  episodeAnnictId: number;
}) {
  const data = await loadAnimeDetailPageData(annictId);

  return (
    <RecordModal
      key={episodeAnnictId}
      annictId={annictId}
      episodeAnnictId={episodeAnnictId}
      work={data?.work ?? null}
      libraryEntries={data?.libraryEntries}
    />
  );
}
