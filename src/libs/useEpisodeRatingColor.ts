"use client";

import { useEffect, useState } from "react";

import { getEpisodeRatingColor } from "~/libs/settings";

export function useEpisodeRatingColor() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(getEpisodeRatingColor());
  }, []);

  return enabled;
}
