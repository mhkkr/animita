import type { Metadata } from "next";

import MyCache from "~/components/mypages/settings/MyCache";
import MyAnimeStatuses from "~/components/mypages/settings/MyAnimeStatuses";
import MyDisplays from "~/components/mypages/settings/MyDisplays";
import MyMute from "~/components/mypages/settings/MyMute";

import Const from "~/constants";

const id = "setting";

export const metadata: Metadata = {
  title: Const.MY_PAGES.find(page => page.id === id)?.title,
};

export default function MyPage() {
  return (
    <div className="*:pt-4 [&>*:not(:first-child)]:mt-4 [&>*:not(:first-child)]:border-t [&>*:not(:first-child)]:dark:border-stone-700">
        <p className="-mb-4 px-4 py-3! bg-annict-100/70 text-white text-sm tabular-nums">
          下記の設定はすべてアニみた独自の機能です。値はブラウザのローカルストレージに保存され、外部に公開されません。Annict には影響ありません。
        </p>
        <MyAnimeStatuses />
        <MyDisplays />
        <MyMute />
        <MyCache />
    </div>
  );
}