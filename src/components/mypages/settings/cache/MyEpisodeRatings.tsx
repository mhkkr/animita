"use client";

import { useEpisodeRatings } from "~/libs/episodeRatings";
import { removeLocalStorageItem } from "~/libs/storage";

import Icons from "~/components/icons/Icons";

import Const from "~/constants";

export default function MyEpisodeRatings() {
  const [episodeRatings, setEpisodeRatings] = useEpisodeRatings();
  const count = Object.keys(episodeRatings).length;

  const handleClick = () => {
    const confirm = window.confirm("本当に削除しますか？");
    if (!confirm) return;
    removeLocalStorageItem(Const.STORAGE_EPISODE_RATINGS);
    setEpisodeRatings({});
  };

  return (
    <dl className="flex gap-4 items-center">
      <dt className="flex-none">
        <p className="-mt-1">エピソード評価 <span className="text-xs dark:text-white/70">({count}件)</span></p>
        <p className="mt-px text-xs dark:text-white/70">エピソードIDと評価値</p>
      </dt>
      <dd className="ml-auto">
        <button
          onClick={handleClick}
          className="flex items-center justify-center w-full pr-4 pl-3 py-1.5 text-white bg-red-500 rounded-lg"
          type="button"
        >
          <Icons id="delete" type="form" className="mr-1" />
          削除
        </button>
      </dd>
    </dl>
  );
}
