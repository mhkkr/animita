import LayoutContainer from '~/components/layouts/Container';

import MyHeader from '~/components/mypages/MyHeader';

import MyMute from '~/components/mypages/MyMute';

import Const from '~/constants';

const id = 'mute';

export const metadata = {
  title: `マイページ（${Const.MY_PAGES.find(page => page.id === id)?.title}）`,
};

export default function MyPage() {
  return (
    <LayoutContainer>
      <MyHeader pageId={id} />
      <MyMute />
    </LayoutContainer>
  );
}