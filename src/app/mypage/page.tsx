import LayoutContainer from '~/components/layouts/Container';

import MyHeader from '~/components/mypages/MyHeader';

import MyProfile from '~/components/mypages/MyProfile';

import Const from '~/constants';

const id = 'profile';

export const metadata = {
  title: `マイページ（${Const.MY_PAGES.find(page => page.id === id)?.title}）`,
};

export default function MyPage() {
  return (
    <LayoutContainer>
      <MyHeader pageId={id} />
      <MyProfile />
    </LayoutContainer>
  );
}