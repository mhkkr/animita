import LayoutContainer from '~/components/layouts/Container';

import AnimeList from '~/components/AnimeList';

export default function Home() {
  return (
    <LayoutContainer>
      <div className="bg-gray-200">
        <div className="max-w-5xl mx-auto">
          <AnimeList />
        </div>
      </div>
    </LayoutContainer>
  );
}