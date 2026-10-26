import LayoutContainer from "~/components/layouts/Container";
import AnimeWorks from "~/components/animes/AnimeWorks";

export default function WorksLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutContainer>
      {children}
      <AnimeWorks />
    </LayoutContainer>
  );
}
