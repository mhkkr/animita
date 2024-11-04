'use client';

import { useEffect, useState } from 'react';

import type { Work } from '~/features/apollo/generated-types';

import { RingSpinner } from '~/components/spinners/Spinner';

import { targetMal, getMal, setMal, fetchJikanAnime } from '~/libs/mal';

const noImage = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 630%22><text x=%2250%%22 y=%2250%%22 style=%22dominant-baseline:central;text-anchor:middle;font-size:13em;%22>No Image</text></svg>';

export default function Thumbnail({ work, view }: { work: Work, view: "list" | "detail" }) {
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState(work.image?.facebookOgImageUrl || noImage);

  // facebookOgImageUrl に値は入っていてもリンク切れなどで読み込めないパターンがあり、
  // その場合、非常に長いロード時間を要するため、一度 MyAnimeList の画像を表示した履歴があればそちらを参照させる仕組み。
  useEffect(() => {
    const mal = getMal();
    const m = targetMal(work.malAnimeId as string, mal);
    if (m && m.image && m.image.active) {
      setUrl(m.image.url);
    }
  }, []);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const element = e.target as HTMLImageElement;

    setLoading(false);

    if (element.src === noImage) {
      handleError(e);
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const element = e.target as HTMLImageElement;

    if (work.malAnimeId) {
      const mal = getMal();
      const m = targetMal(work.malAnimeId, mal);

      if (m) {
        element.src = m.image.url;
      } else {
        setLoading(true);
        
        fetchJikanAnime(work.malAnimeId)
          .then(response => {
            if (response && response.data && response.data.images) {
              element.src = response.data.images.webp.large_image_url;
              setMal((work.malAnimeId as string), response.data, true);
            } else {
              element.src = noImage;
            }
          })
          .catch(console.error);
      }
    } else {
      element.src = noImage;
    }
  };

  return (
    <figure className="-z-10 relative pt-[52.5%] bg-gray-400/70 dark:bg-gray-700/70 text-gray-700/70 overflow-hidden [contain:content]">
      {loading && (
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${view === "detail" ? "text-5xl" : "text-3xl"} text-annict-100`}><RingSpinner /></div>
      )}
      <img
        className="absolute left-0 top-0 w-full h-full object-contain"
        src={url}
        alt={`${work.title}のキービジュアル`}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
      />
    </figure>
  );
}