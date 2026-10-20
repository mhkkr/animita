import { Suspense } from "react";

import LayoutContainer from "~/components/layouts/Container";
import AnimeDetail from "~/components/animes/AnimeDetail";
import { RingSpinner } from "~/components/spinners/Spinner";
import { loadAnimeDetailPageData } from "~/features/apollo/loaders";

type Params = {
  params: Promise<{ annictId: string }>;
};

export const metadata = {
  title: "詳細",
};

function DetailFallback() {
  return (
    <div className="pt-12 border-t dark:border-stone-700 text-center text-5xl text-annict-100">
      <RingSpinner />
    </div>
  );
}

export default async function Works({ params }: Params) {
  const annictId = parseInt((await params).annictId, 10);
  const data = await loadAnimeDetailPageData(annictId);

  return (
    <LayoutContainer>
      <Suspense fallback={<DetailFallback />}>
        <AnimeDetail
          annictId={annictId}
          initialWork={data?.work ?? null}
          initialLibraryEntries={data?.libraryEntries ?? null}
          initialError={data?.error}
        />
      </Suspense>
    </LayoutContainer>
  );
}
