import { notFound } from "next/navigation";

import AnimeRecordRoute from "~/components/animes/AnimeRecordRoute";

type Params = {
  params: Promise<{ annictId: string; episodeAnnictId: string }>;
};

export default async function RecordModalPage({ params }: Params) {
  const { annictId, episodeAnnictId } = await params;
  const workId = Number(annictId);
  const episodeId = Number(episodeAnnictId);

  if (!Number.isInteger(workId) || !Number.isInteger(episodeId)) {
    notFound();
  }

  return <AnimeRecordRoute annictId={workId} episodeAnnictId={episodeId} />;
}
