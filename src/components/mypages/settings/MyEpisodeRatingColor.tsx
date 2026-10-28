"use client";

import { useEffect, useState } from "react";

import ChoiceButtons from "~/components/mypages/settings/ChoiceButtons";
import { getEpisodeRatingColor, setEpisodeRatingColor } from "~/libs/settings";

export default function MyEpisodeRatingColor() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(getEpisodeRatingColor());
  }, []);

  const handleChange = (next: string) => {
    const enabledNext = next === "on";
    setEpisodeRatingColor(enabledNext);
    setEnabled(enabledNext);
  };

  return (
    <ChoiceButtons
      ariaLabel="エピソード評価色"
      name="episode-rating-color"
      value={enabled ? "on" : "off"}
      options={[
        { id: "on", label: "付ける" },
        { id: "off", label: "付けない" },
      ]}
      onChange={handleChange}
    />
  );
}
