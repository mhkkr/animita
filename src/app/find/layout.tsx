import LayoutContainer from "~/components/layouts/Container";
import AnimeFind from "~/components/animes/AnimeFind";

export default function FindLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutContainer>
      {children}
      <AnimeFind />
    </LayoutContainer>
  );
}
