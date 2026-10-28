"use client";

import { useEffect, useState } from "react";

import { getMal } from "~/libs/mal";
import { removeLocalStorageItem } from "~/libs/storage";

import Icons from "~/components/icons/Icons";

import Const from "~/constants";

export default function MyMal() {
  const [malCount, setMalCount] = useState(0);

  useEffect(() => {
    setMalCount(getMal().length);
  }, []);

  const handleClick = () => {
    const confirm = window.confirm("本当に削除しますか？");
    if (confirm) {
      removeLocalStorageItem(Const.STORAGE_MAL);
      setMalCount(getMal().length);
    }
  };

  return (
    <dl className="flex gap-4 items-center">
      <dt className="flex-none">
        <p className="-mt-1">MyAnimeList <span className="text-xs dark:text-white/70">({malCount}件)</span></p>
        <p className="mt-px text-xs dark:text-white/70">画像URLと全話数</p>
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
