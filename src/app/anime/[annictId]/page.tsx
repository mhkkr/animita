import LayoutContainer from '~/components/layouts/Container';

import AnimeDetail from '~/components/AnimeDetail';

export default function Works({ params }: { params: { annictId: string } }) {
  return (
    <LayoutContainer>
      <AnimeDetail annictId={params.annictId} />
    </LayoutContainer>
  );
}