"use client";

import { useEffect, useState } from "react";

import ChoiceButtons from "~/components/mypages/settings/ChoiceButtons";
import { displays, setSetting, getSetting } from "~/libs/settings";
import type { DisplayId } from "~/types/settings";

export default function MySelect({ label, id }: { label: string, category?: "displays", id: DisplayId }) {
  const [select, setSelect] = useState(displays[id].default);

  useEffect(() => {
    setSelect(getSetting("displays", id));
  }, [id]);

  const handleChange = (next: string) => {
    setSetting("displays", id, next);
    setSelect(next);
  };

  return (
    <ChoiceButtons
      label={label}
      name={`display-${id}`}
      value={select}
      options={displays[id].value}
      onChange={handleChange}
    />
  );
}
