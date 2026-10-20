"use client";

import { useEffect, useState } from "react";

import { displays, setSetting, getSetting } from "~/libs/settings";
import type { DisplayId } from "~/types/settings";

export default function MySelect({ label, id }: { label: string, category?: "displays", id: DisplayId }) {
  const [select, setSelect] = useState(displays[id].default);

  useEffect(() => {
    setSelect(getSetting("displays", id));
  }, [id]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValuation = event.currentTarget.value;
    setSetting("displays", id, newValuation);
    setSelect(newValuation);
  };

  return (
    <dl className="flex gap-4 items-center">
      <dt className="flex-none">{label}</dt>
      <dd className="ml-auto">
        <select
          className="w-full dark:bg-black border dark:border-stone-700 px-1 py-2 rounded"
          onChange={handleChange}
          value={select}
        >
          {displays[id].value.map((value) => (
            <option key={value.id} value={value.id}>{value.label}</option>
          ))}
        </select>
      </dd>
    </dl>
  );
}
