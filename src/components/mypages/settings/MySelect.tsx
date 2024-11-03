'use client';

import { useState } from 'react';

import { displays, setSetting, getSetting } from '~/libs/settings';
import type { Category, Id } from '~/types/settings';

export default function MySelect({ label, category, id }: { label: string, category: Category, id: Id }) {
  const [select, setSelect] = useState(getSetting(category, id));

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValuation = event.currentTarget.value;
    setSetting(category, id, newValuation);
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
          {displays.evaluation.value.map(value => {
            return (
              <option key={value.id} value={value.id}>{value.label}</option>
            )
          })}
        </select>
      </dd>
    </dl>
  );
}