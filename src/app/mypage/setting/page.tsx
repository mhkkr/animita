import LayoutContainer from '~/components/layouts/Container';

import MyHeader from '~/components/mypages/MyHeader';

import MyCache from "~/components/mypages/settings/MyCache";
import MyAnimeStatuses from "~/components/mypages/settings/MyAnimeStatuses";
import MyDisplays from "~/components/mypages/settings/MyDisplays";
import MyMute from "~/components/mypages/settings/MyMute";

import Const from "~/constants";

const id = "setting";

export const metadata = {
  title: Const.MY_PAGES.find(page => page.id === id)?.title,
};

export default function MyPage() {
  return (
    <LayoutContainer>
      <MyHeader pageId={id} />
      <div className="[&>*]:pt-4 [&>*:not(:first-child)]:mt-4 [&>*:not(:first-child)]:border-t [&>*:not(:first-child)]:dark:border-stone-700">
        <MyAnimeStatuses />
        <MyDisplays />
        <MyMute />
        <MyCache />
      </div>
    </LayoutContainer>
  );
}