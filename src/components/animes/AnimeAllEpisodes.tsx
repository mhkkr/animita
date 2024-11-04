'use client';

import { useState, useEffect } from "react";

import { RingSpinner } from '~/components/spinners/Spinner';

import { targetMal, getMal, setMal, fetchJikanAnime } from '~/libs/mal';

export default function AllEpisodes({ malAnimeId }: { malAnimeId: string }) {
  const [episodes, setEpisodes] = useState<number>(0);

  useEffect(() => {
    const mal = getMal();
    const m = targetMal(malAnimeId, mal);

    if (m) {
      setEpisodes(m.episodes);
    } else {
      fetchJikanAnime(malAnimeId)
        .then(response => {
          if (response.data.images) {
            setEpisodes(response.data.episodes);
            setMal(malAnimeId, response.data);
          }
        })
        .catch(console.error);
    }
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