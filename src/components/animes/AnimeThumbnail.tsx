'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { Work } from '~/features/apollo/generated-types';

import { RingSpinner } from '~/components/spinners/Spinner';

import { targetMal, getMal, setMal, fetchJikanAnime } from '~/libs/mal';

const noImage = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 630%22><text x=%2250%%22 y=%2250%%22 style=%22dominant-baseline:central;text-anchor:middle;font-size:13em;%22>No Image</text></svg>';

function useWhenVisible(enabled: boolean) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled || visible) return;
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      setVisible(true);
      observer.disconnect();
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled, visible]);

  return { ref, visible };
}

function ListThumbnail({ work }: { work: Work }) {
  const { ref, visible } = useWhenVisible(Boolean(work.malAnimeId));
  const [url, setUrl] = useState(noImage);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!work.malAnimeId) {
      setUrl(noImage);
      setLoading(false);
      return;
    }

    const cached = targetMal(work.malAnimeId, getMal());
    if (cached?.image.url) {
      setUrl(cached.image.url);
      return;
    }

    if (!visible) return;

    let cancelled = false;
    setLoading(true);
    fetchJikanAnime(work.malAnimeId)
      .then((response) => {
        if (cancelled) return;
        const imageUrl = response?.data?.images?.webp?.large_image_url;
        if (!imageUrl) {
          setUrl(noImage);
          setLoading(false);
          return;
        }
        setUrl(imageUrl);
        setMal(work.malAnimeId as string, response.data);
      })
      .catch(() => {
        if (!cancelled) {
          setUrl(noImage);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [work.malAnimeId, visible]);

  return (
    <figure ref={ref} className="relative overflow-hidden aspect-425/600 bg-gray-400/70 text-gray-700/70 dark:bg-gray-700/70">
      {loading && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl text-annict-100"><RingSpinner /></div>
      )}
      <img
        className={`h-full w-full object-contain ${url === noImage ? "dark:invert" : ""}`}
        src={url}
        alt={`${work.title}の画像`}
        loading="lazy"
        onLoad={() => setLoading(false)}
        onError={() => {
          setUrl(noImage);
          setLoading(false);
        }}
      />
    </figure>
  );
}

function DetailThumbnail({ work }: { work: Work }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const fetchingRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState(work.image?.facebookOgImageUrl || noImage);

  const fallback = useCallback((element: HTMLImageElement) => {
    if (!work.malAnimeId) {
      if (element.src !== noImage) {
        element.src = noImage;
      } else {
        setLoading(false);
      }
      return;
    }

    const mal = getMal();
    const m = targetMal(work.malAnimeId, mal);

    if (m?.image?.url) {
      if (element.src !== m.image.url) {
        element.src = m.image.url;
      } else {
        setLoading(false);
      }
      return;
    }

    if (fetchingRef.current) return;

    fetchingRef.current = true;
    setLoading(true);

    fetchJikanAnime(work.malAnimeId)
      .then(response => {
        if (response && response.data && response.data.images) {
          element.src = response.data.images.webp.large_image_url;
          setMal((work.malAnimeId as string), response.data, true);
        } else if (element.src !== noImage) {
          element.src = noImage;
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      })
      .finally(() => {
        fetchingRef.current = false;
      });
  }, [work.malAnimeId]);

  const handleLoad = useCallback((element: HTMLImageElement) => {
    setLoading(false);

    if (element.src === noImage) {
      fallback(element);
    }
  }, [fallback]);

  // facebookOgImageUrl に値は入っていてもリンク切れなどで読み込めないパターンがあり、
  // その場合、非常に長いロード時間を要するため、一度 MyAnimeList の画像を表示した履歴があればそちらを参照させる仕組み。
  useEffect(() => {
    const mal = getMal();
    const m = targetMal(work.malAnimeId as string, mal);
    if (m && m.image && m.image.active) {
      setUrl(m.image.url);
    }
  }, [work.malAnimeId]);

  // 詳細ページは SSR の img がビューポート内にある。
  // リロード時はキャッシュ読み込みがハイドレーションより先に終わり、onLoad / onError が付かない。
  useEffect(() => {
    const element = imgRef.current;
    if (!element?.complete) return;

    if (element.naturalWidth > 0) {
      handleLoad(element);
      return;
    }

    fallback(element);
  }, [url, fallback, handleLoad]);

  return (
    <figure className="z-0 relative aspect-1200/630 bg-gray-400/70 dark:bg-gray-700/70 text-gray-700/70 overflow-hidden">
      {loading && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl text-annict-100"><RingSpinner /></div>
      )}
      <img
        ref={imgRef}
        className={`h-full w-full object-contain ${url === noImage ? "dark:invert" : ""}`}
        src={url}
        alt={`${work.title}のキービジュアル`}
        onLoad={(e) => handleLoad(e.currentTarget)}
        onError={(e) => fallback(e.currentTarget)}
      />
    </figure>
  );
}

export default function Thumbnail({ work, view }: { work: Work, view: "list" | "detail" }) {
  if (view === "list") {
    return <ListThumbnail work={work} />;
  }
  return <DetailThumbnail work={work} />;
}