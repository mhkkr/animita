import LayoutContainer from '~/components/layouts/Container';

import MyRecords from '~/components/animes/MyRecords';

export const metadata = {
  title: 'マイページ',
};

export default function MyPage() {
  return (
    <LayoutContainer>
      <h1 className="mb-8 px-4 py-3 pt-1 sm:py-3 text-center text-lg font-bold border-b dark:border-white/25">{metadata.title}</h1>

      <MyRecords />
    </LayoutContainer>
  );
}