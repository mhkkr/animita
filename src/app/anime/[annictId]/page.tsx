import LayoutContainer from '~/components/layouts/Container';

import AnimeDetail from '~/components/animes/AnimeDetail';

type Params = {
  params: { annictId: string }
};

export const metadata = {
  title: '詳細',
};

// TODO: タイトル取得したいけど、上手くいく手法が分からない
// export async function generateMetadata({ params }: Params): Promise<Metadata> {
//   const work = data?.searchWorks?.nodes ? (data?.searchWorks?.nodes[0] as Work) : null;
//   return { title: work?.title }
// }

export default function Works({ params }: Params) {
  const annictIdInt = parseInt(params.annictId, 10);
  return (
    <LayoutContainer>
      <AnimeDetail annictId={annictIdInt} />
    </LayoutContainer>
  );
}