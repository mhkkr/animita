import LayoutContainer from "~/components/layouts/Container";
import AnimeDetail from "~/components/animes/AnimeDetail";
import { loadAnimeDetailPageData } from "~/features/apollo/loaders";

type LayoutProps = {
  children: React.ReactNode;
  modal: React.ReactNode;
  params: Promise<{ annictId: string }>;
};

export default async function AnimeLayout({ children, modal, params }: LayoutProps) {
  const annictId = parseInt((await params).annictId, 10);
  const data = await loadAnimeDetailPageData(annictId);

  return (
    <>
      {children}
      <LayoutContainer>
        <AnimeDetail
          annictId={annictId}
          initialWork={data?.work ?? null}
          initialLibraryEntries={data?.libraryEntries ?? null}
          initialError={data?.error}
        />
      </LayoutContainer>
      {modal}
    </>
  );
}
