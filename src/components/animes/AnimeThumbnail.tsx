'use client';

import type { Work } from '~/features/apollo/generated-types';

import { fetchJikanAnime } from '~/libs/function';

const noImage = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 630%22><text x=%2250%%22 y=%2250%%22 style=%22dominant-baseline:central;text-anchor:middle;font-size:13em;%22>No Image</text></svg>';

export default function Thumbnail({ work }: { work: Work }) {
  const url = work.image?.facebookOgImageUrl || '';

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const element = e.target as HTMLImageElement;

    if (work.malAnimeId) {
      fetchJikanAnime(work.malAnimeId)
        .then(response => {
          if (response.data.images.webp.large_image_url) {
            element.src = response.data.images.webp.large_image_url;
          } else {
            element.src = noImage;
          }
        })
        .catch(console.error);
    } else {
      element.src = noImage;
    }
  };

  return (
    <figure className="aspect-video bg-gray-700/70">
      <img className="w-full h-full object-contain" src={url} alt={`${work.title}のキービジュアル`} loading="lazy" onError={handleError} />
    </figure>
  );
}