import LayoutContainer from '~/components/layouts/Container';

import MyHeader from '~/components/mypages/MyHeader';

import MyCache from '~/components/mypages/settings/MyCache';
import MyDisplays from '~/components/mypages/settings/MyDisplays';
import MyMute from '~/components/mypages/settings/MyMute';

import Const from '~/constants';

const id = 'setting';

export const metadata = {
  title: `マイページ（${Const.MY_PAGES.find(page => page.id === id)?.title}）`,
};

export default function MyPage() {
  return (
    <LayoutContainer>
      <MyHeader pageId={id} />
      <div className="[&>*]:mt-4 [&>*]:pt-4 [&>*]:border-t first:[&>*]:pt-0 first:[&>*]:border-t-0 [&>*]:dark:border-stone-700">
        <MyCache />
        <MyDisplays />
        <MyMute />
      </div>
    </LayoutContainer>
  );
}