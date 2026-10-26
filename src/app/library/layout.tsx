import LayoutContainer from "~/components/layouts/Container";
import AnimeLibrary from "~/components/animes/AnimeLibrary";

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutContainer>
      {children}
      <AnimeLibrary />
    </LayoutContainer>
  );
}
