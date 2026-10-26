"use client";

import { useEffect, useRef, useState } from "react";

import type { Work } from "~/features/apollo/generated-types";

import { RingSpinner } from "~/components/spinners/Spinner";

import { targetMal, getMal, setMal, fetchJikanAnime } from "~/libs/mal";

const noImage = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 630%22><text x=%2250%%22 y=%2250%%22 style=%22dominant-baseline:central;text-anchor:middle;font-size:13em;%22>No Image</text></svg>";

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

function useMalImage(malAnimeId: string | null | undefined, enabled: boolean) {
  const [url, setUrl] = useState<string | null>(malAnimeId ? null : noImage);
  const [loading, setLoading] = useState(Boolean(malAnimeId));
  const [cacheChecked, setCacheChecked] = useState(!malAnimeId);

  useEffect(() => {
    if (!malAnimeId) {
      setUrl(noImage);
      setLoading(false);
      setCacheChecked(true);
      return;
    }

    const cached = targetMal(malAnimeId, getMal());
    setCacheChecked(true);
    if (cached?.image.url) {
      setUrl(cached.image.url);
      return;
    }

    if (!enabled) return;

    let cancelled = false;
    setLoading(true);
    fetchJikanAnime(malAnimeId)
      .then((response) => {
        if (cancelled) return;
        const imageUrl = response?.data?.images?.webp?.large_image_url;
        if (!imageUrl) {
          setUrl(noImage);
          setLoading(false);
          return;
        }
        setUrl(imageUrl);
        setMal(malAnimeId, response.data);
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
  }, [malAnimeId, enabled]);

  return {
    url,
    loading,
    cacheChecked,
    finish: () => setLoading(false),
    fail: () => {
      setUrl(noImage);
      setLoading(false);
    },
  };
}

function usableImage(url?: string | null) {
  const trimmed = url?.trim();
  return trimmed ? trimmed : null;
}

export function MalThumb({
  malAnimeId,
  title,
  ogpUrl,
  lazy = false,
  backdrop = false,
  switchable = false,
  figureClassName,
  spinnerClassName,
}: {
  malAnimeId?: string | null;
  title: string;
  ogpUrl?: string | null;
  lazy?: boolean;
  backdrop?: boolean;
  switchable?: boolean;
  figureClassName: string;
  spinnerClassName: string;
}) {
  const hasSource = Boolean(malAnimeId || usableImage(ogpUrl));
  const { ref, visible } = useWhenVisible(lazy && hasSource);
  const { url, loading, cacheChecked, finish, fail } = useMalImage(malAnimeId, lazy ? visible : true);
  const [ogpFailed, setOgpFailed] = useState(false);
  const [source, setSource] = useState<"mal" | "ogp">("mal");
  const malPoster = url && url !== noImage ? url : null;
  const ogp = ogpFailed || (malAnimeId && !cacheChecked) ? null : usableImage(ogpUrl);
  const ready = !lazy || visible || !hasSource;
  const malFirst = malPoster ?? ogp ?? (url === noImage ? noImage : null);
  const ogpFirst = ogp ?? malPoster ?? (url === noImage ? noImage : null);
  const displayUrl = ready ? (switchable && source === "ogp" ? ogpFirst : malFirst) : null;
  const shown = displayUrl && displayUrl === ogp && displayUrl !== malPoster ? "ogp" : displayUrl === malPoster ? "mal" : null;

  useEffect(() => {
    setOgpFailed(false);
    setSource("mal");
  }, [ogpUrl, malAnimeId]);
  const showBackdrop = backdrop && !!displayUrl && displayUrl !== noImage;

  return (
    <figure ref={lazy ? ref : undefined} className={`relative z-0 ${figureClassName}`}>
      {switchable && malPoster && ogp ? (
        <>
          {backdrop && (
            <>
              <img
                className={`pointer-events-none absolute inset-0 h-full w-full object-cover blur-xl brightness-50 transition-opacity duration-300 ease-out motion-reduce:transition-none ${shown === "mal" ? "opacity-100" : "opacity-0"}`}
                src={malPoster}
                alt=""
                aria-hidden="true"
              />
              <img
                className={`pointer-events-none absolute inset-0 h-full w-full object-cover blur-xl brightness-50 transition-opacity duration-300 ease-out motion-reduce:transition-none ${shown === "ogp" ? "opacity-100" : "opacity-0"}`}
                src={ogp}
                alt=""
                aria-hidden="true"
              />
            </>
          )}
          <img
            className={`absolute inset-0 z-10 h-full w-full object-contain transition-opacity duration-300 ease-out motion-reduce:transition-none ${shown === "mal" ? "opacity-100" : "opacity-0"}`}
            src={malPoster}
            alt={shown === "mal" ? `${title}の画像` : ""}
            aria-hidden={shown === "mal" ? undefined : true}
            onLoad={finish}
            onError={fail}
          />
          <img
            className={`absolute inset-0 z-10 h-full w-full object-contain transition-opacity duration-300 ease-out motion-reduce:transition-none ${shown === "ogp" ? "opacity-100" : "opacity-0"}`}
            src={ogp}
            alt={shown === "ogp" ? `${title}の画像` : ""}
            aria-hidden={shown === "ogp" ? undefined : true}
            onLoad={finish}
            onError={() => {
              setOgpFailed(true);
              setSource("mal");
            }}
          />
        </>
      ) : (
        <>
          {showBackdrop && (
            <img
              className="pointer-events-none absolute inset-0 h-full w-full object-cover blur-xl brightness-50"
              src={displayUrl ?? undefined}
              alt=""
              aria-hidden="true"
            />
          )}
          {displayUrl && (
            <img
              className={`relative z-10 h-full w-full object-contain ${displayUrl === noImage ? "dark:invert" : ""}`}
              src={displayUrl}
              alt={`${title}の画像`}
              loading={lazy ? "lazy" : undefined}
              onLoad={finish}
              onError={() => {
                if (displayUrl === ogp) {
                  setOgpFailed(true);
                  setSource("mal");
                  return;
                }
                fail();
              }}
            />
          )}
        </>
      )}
      {!displayUrl && loading && (
        <div className={`absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-annict-100 ${spinnerClassName}`}><RingSpinner /></div>
      )}
      {switchable && malPoster && ogp && (
        <button
          type="button"
          className="absolute right-3 bottom-3 z-20 h-14 w-14 overflow-hidden rounded-md border-2 border-white/80 shadow-md"
          aria-label={shown === "ogp" ? "MyAnimeListの画像に切り替える" : "OGP画像に切り替える"}
          onClick={() => setSource(shown === "ogp" ? "mal" : "ogp")}
        >
          <img
            className="h-full w-full object-cover"
            src={shown === "ogp" ? malPoster : ogp}
            alt=""
          />
        </button>
      )}
    </figure>
  );
}

const posterFrame = "overflow-hidden bg-gray-400/70 text-gray-700/70 dark:bg-gray-700/70";

function ListThumbnail({ work }: { work: Work }) {
  return (
    <MalThumb
      malAnimeId={work.malAnimeId}
      title={work.title}
      ogpUrl={work.image?.facebookOgImageUrl}
      lazy
      figureClassName={`${posterFrame} aspect-425/600`}
      spinnerClassName="text-3xl"
    />
  );
}

function DetailThumbnail({ work }: { work: Work }) {
  return (
    <MalThumb
      malAnimeId={work.malAnimeId}
      title={work.title}
      ogpUrl={work.image?.facebookOgImageUrl}
      backdrop
      switchable
      figureClassName={`${posterFrame} flex aspect-1200/630 items-center justify-center`}
      spinnerClassName="text-5xl"
    />
  );
}

export default function Thumbnail({ work, view }: { work: Work, view: "list" | "detail" }) {
  if (view === "list") {
    return <ListThumbnail work={work} />;
  }
  return <DetailThumbnail work={work} />;
}
