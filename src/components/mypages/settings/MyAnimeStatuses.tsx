"use client";

import { useEffect, useState } from "react";

import {
  ANIME_PAGE_STATUS_OPTIONS,
  DEFAULT_ANIME_LIST_STATUSES,
  getAnimeListStatuses,
  setAnimeListStatuses,
} from "~/libs/settings";

export default function MyAnimeStatuses() {
  const [statuses, setStatuses] = useState<string[]>([...DEFAULT_ANIME_LIST_STATUSES]);

  useEffect(() => {
    setStatuses(getAnimeListStatuses());
  }, []);

  const handleChange = (statusId: string, checked: boolean) => {
    const next = checked
      ? [...statuses, statusId]
      : statuses.filter((id) => id !== statusId);

    if (next.length === 0) {
      return;
    }

    const ordered = ANIME_PAGE_STATUS_OPTIONS
      .map((state) => state.id)
      .filter((id) => next.includes(id));

    setAnimeListStatuses(ordered);
    setStatuses(ordered);
  };

  return (
    <section>
      <header className="px-4">
        <h1 className="text-lg font-bold">視聴可能・視聴中</h1>
        <p className="mt-1 text-xs dark:text-white/70">
          「視聴可能」「視聴中」に表示する視聴ステータスを選べます。
        </p>
      </header>

      <ul className="mt-4 grid gap-2 px-4">
        {ANIME_PAGE_STATUS_OPTIONS.map((state) => {
          const checked = statuses.includes(state.id);
          const isDefault = (DEFAULT_ANIME_LIST_STATUSES as readonly string[]).includes(state.id);
          return (
            <li key={state.id}>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="size-4 accent-annict-100"
                  checked={checked}
                  onChange={(event) => handleChange(state.id, event.target.checked)}
                />
                <span className="font-medium">{state.label}</span>
                {isDefault && (
                  <span className="text-xs dark:text-white/50">（初期選択）</span>
                )}
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
