import LayoutContainer from '~/components/layouts/Container';

import MyHeader from '~/components/mypages/MyHeader';

import MyRecords from '~/components/mypages/MyRecords';

import Const from '~/constants';

const id = 'records';

export const metadata = {
  title: `マイページ（${Const.MY_PAGES.find(page => page.id === id)?.title}）`,
};

export default function MyPage() {
  return (
    <LayoutContainer>
      <MyHeader pageId={id} />
      <MyRecords />
    </LayoutContainer>
  );
}