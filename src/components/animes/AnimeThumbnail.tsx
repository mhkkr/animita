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
  const [url, setUrl] = useState<string | null>(work.malAnimeId ? null : noImage);
  const [loading, setLoading] = useState(Boolean(work.malAnimeId));

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
      {url && (
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
      )}
    </figure>
  );
}

function DetailThumbnail({ work }: { work: Work }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const fetchingRef = useRef(false);
  const ogpUrl = work.image?.facebookOgImageUrl || null;
  const [loading, setLoading] = useState(Boolean(ogpUrl || work.malAnimeId));
  const [url, setUrl] = useState<string | null>(ogpUrl ?? (work.malAnimeId ? null : noImage));

  const showNoImage = useCallback(() => {
    setUrl(noImage);
    setLoading(false);
  }, []);

  const fallback = useCallback(() => {
    if (!work.malAnimeId) {
      showNoImage();
      return;
    }

    const cached = targetMal(work.malAnimeId, getMal());
    if (cached?.image.url && cached.image.url !== url) {
      setUrl(cached.image.url);
      return;
    }
    if (cached?.image.url && cached.image.url === url) {
      showNoImage();
      return;
    }

    if (fetchingRef.current) return;

    fetchingRef.current = true;
    setLoading(true);

    fetchJikanAnime(work.malAnimeId)
      .then((response) => {
        const imageUrl = response?.data?.images?.webp?.large_image_url;
        if (!imageUrl) {
          showNoImage();
          return;
        }
        setUrl(imageUrl);
        setMal(work.malAnimeId as string, response.data, true);
      })
      .catch(() => {
        showNoImage();
      })
      .finally(() => {
        fetchingRef.current = false;
      });
  }, [url, showNoImage, work.malAnimeId]);

  // facebookOgImageUrl に値は入っていてもリンク切れなどで読み込めないパターンがあり、
  // その場合、非常に長いロード時間を要するため、一度 MyAnimeList の画像を表示した履歴があればそちらを参照させる仕組み。
  useEffect(() => {
    const cached = work.malAnimeId ? targetMal(work.malAnimeId, getMal()) : null;
    if (cached?.image.active && cached.image.url) {
      setUrl(cached.image.url);
      return;
    }
    if (ogpUrl || !work.malAnimeId) return;

    if (cached?.image.url) {
      setUrl(cached.image.url);
      return;
    }

    let cancelled = false;
    fetchingRef.current = true;
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
        setMal(work.malAnimeId as string, response.data, true);
      })
      .catch(() => {
        if (!cancelled) {
          setUrl(noImage);
          setLoading(false);
        }
      })
      .finally(() => {
        fetchingRef.current = false;
      });

    return () => {
      cancelled = true;
    };
  }, [ogpUrl, work.malAnimeId]);

  // 詳細ページは SSR の img がビューポート内にある。
  // リロード時はキャッシュ読み込みがハイドレーションより先に終わり、onLoad / onError が付かない。
  useEffect(() => {
    const element = imgRef.current;
    if (!url || url === noImage || !element?.complete) return;
    if (element.currentSrc !== url) return;

    if (element.naturalWidth > 0) {
      setLoading(false);
      return;
    }

    fallback();
  }, [url, fallback]);

  return (
    <figure className="z-0 relative aspect-1200/630 bg-gray-400/70 dark:bg-gray-700/70 text-gray-700/70 overflow-hidden">
      {loading && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl text-annict-100"><RingSpinner /></div>
      )}
      {url && (
        <img
          ref={imgRef}
          className={`h-full w-full object-contain ${url === noImage ? "dark:invert" : ""}`}
          src={url}
          alt={`${work.title}のキービジュアル`}
          onLoad={() => setLoading(false)}
          onError={() => {
            if (url === noImage) {
              setLoading(false);
              return;
            }
            fallback();
          }}
        />
      )}
    </figure>
  );
}

export default function Thumbnail({ work, view }: { work: Work, view: "list" | "detail" }) {
  if (view === "list") {
    return <ListThumbnail work={work} />;
  }
  return <DetailThumbnail work={work} />;
}