'use client';

import type { Work } from '~/features/apollo/generated-types';

import { targetMal, getMal, setMal, fetchJikanAnime } from '~/libs/mal';

const noImage = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 630%22><text x=%2250%%22 y=%2250%%22 style=%22dominant-baseline:central;text-anchor:middle;font-size:13em;%22>No Image</text></svg>';

export default function Thumbnail({ work }: { work: Work }) {
  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const element = e.target as HTMLImageElement;
    if (element.src === noImage) {
      handleError(e);
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const element = e.target as HTMLImageElement;

    if (work.malAnimeId) {
      const mal = getMal();
      const m = targetMal(mal, work.malAnimeId);

      if (m) {
        element.src = m.largeImageUrl;
      } else {
        fetchJikanAnime(work.malAnimeId)
          .then(response => {
            if (response.data.images) {
              element.src = response.data.images.webp.large_image_url;
              setMal((work.malAnimeId as string), response.data);
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
    <figure className="-z-10 relative pt-[52.5%] bg-gray-700/70 text-gray-700/70 overflow-hidden [contain:content]">
      <img
        className="absolute left-0 top-0 w-full h-full object-contain"
        src={work.image?.facebookOgImageUrl || noImage}
        alt={`${work.title}のキービジュアル`}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
      />
    </figure>
  );
}