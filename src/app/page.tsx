import LayoutContainer from '~/components/layouts/Container';

import AnimeList from '~/components/animes/AnimeList';

import Const from '~/constants';

export const metadata = {
  alternates: {
    canonical: Const.URL,
  },
};

export default function Home() {
  return (
    <LayoutContainer>
      <AnimeList />
    </LayoutContainer>
  );
}