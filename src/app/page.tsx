import LayoutContainer from '~/components/layouts/Container';

import AnimeList from '~/components/animes/AnimeList';

export default function Home() {
  return (
    <LayoutContainer>
      <AnimeList />
    </LayoutContainer>
  );
}