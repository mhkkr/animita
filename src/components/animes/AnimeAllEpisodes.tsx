'use client';

import { useState, useEffect } from "react";

import { RingSpinner } from '~/components/spinners/Spinner';

import { fetchJikanAnime } from '~/libs/function';

export default function AllEpisodes({ malAnimeId }: { malAnimeId: string }) {
  const [episodes, setEpisodes] = useState<number>(0);

  useEffect(() => {
    fetchJikanAnime(malAnimeId)
      .then(response => {
        setEpisodes(response.data.episodes);
      })
      .catch(console.error);
  }, []);

  if (episodes === null) {
    return (
      <span>（全話数不明）</span>
    );
  }

  return (
    <span>（全{episodes ? episodes : <div className="inline mx-2 text-annict-100"><RingSpinner /></div>}話）</span>
  );
}