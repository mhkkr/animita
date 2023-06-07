'use client';

// TODO: 公式サイトのOGPイメージ直リンクのままでいいのかな…？
//       できれば cdn.myanimelist.net に変えたがいい気がするけど。

import { useState, useEffect } from "react";
import type { Work } from '~/features/apollo/generated-types';

// https://github.com/SlashNephy/annict-tracker
type JikanAnimePictures = {
  data: {
    jpg?: {
      image_url?: string
      small_image_url?: string
      large_image_url?: string
    }
    webp?: {
      image_url?: string
      small_image_url?: string
      large_image_url?: string
    }
  }[]
};

export default function Thumbnail({ work, className }: { work: Work, className: string }) {
  const noImage = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 630%22><text x=%2250%%22 y=%2250%%22 style=%22dominant-baseline:central;text-anchor:middle;font-size:13em;%22>No Image</text></svg>';
  const url = work.image?.facebookOgImageUrl || '';

  // const [data, setData] = useState<JikanAnimePictures>();

  // useEffect(() => {
  //   fetch(`https://api.jikan.moe/v4/anime/${work.malAnimeId}/pictures`)
  //     .then((res) => res.json())
  //     .then((json: JikanAnimePictures) => setData(json))
  //     .catch(() => alert("error"));
  // }, []);

  // if (!data) return <></>;

  // let url = noImage;
  // if (data && data.data[0]) {
  //   if (data.data[0].webp?.large_image_url) url = data.data[0].webp.large_image_url;
  //   if (data.data[0].jpg?.large_image_url) url = data.data[0].jpg.large_image_url;
  // }

  return (
    <img className={className} src={url} alt={`${work.title}のサムネイル`} loading="lazy" onError={e => (e.target as HTMLImageElement).src = noImage} />
  );
}