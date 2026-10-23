"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "loading" | "done";

function isInternalNavigation(anchor: HTMLAnchorElement, event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#")) return false;

  let url: URL;
  try {
    url = new URL(anchor.href, window.location.href);
  } catch {
    return false;
  }

  if (url.origin !== window.location.origin) return false;
  return url.pathname !== window.location.pathname || url.search !== window.location.search;
}

export default function NavigationProgress() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [width, setWidth] = useState(0);
  const pathnameRef = useRef(pathname);
  const phaseRef = useRef(phase);
  const trickleRef = useRef<number | null>(null);
  const stallRef = useRef<number | null>(null);
  const hideRef = useRef<number | null>(null);

  const stopTrickle = () => {
    if (trickleRef.current !== null) {
      window.clearInterval(trickleRef.current);
      trickleRef.current = null;
    }
  };

  const finish = () => {
    if (phaseRef.current !== "loading") return;
    phaseRef.current = "done";
    stopTrickle();
    if (stallRef.current !== null) {
      window.clearTimeout(stallRef.current);
      stallRef.current = null;
    }
    setWidth(100);
    setPhase("done");
    if (hideRef.current !== null) window.clearTimeout(hideRef.current);
    hideRef.current = window.setTimeout(() => {
      phaseRef.current = "idle";
      setPhase("idle");
      setWidth(0);
      hideRef.current = null;
    }, 200);
  };

  const start = () => {
    if (hideRef.current !== null) {
      window.clearTimeout(hideRef.current);
      hideRef.current = null;
    }
    if (stallRef.current !== null) window.clearTimeout(stallRef.current);

    const continuing = phaseRef.current === "loading";
    phaseRef.current = "loading";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPhase("loading");
    setWidth((current) => (continuing && current > 0 && current < 100 ? current : 12));

    stopTrickle();
    if (!reduceMotion) {
      trickleRef.current = window.setInterval(() => {
        setWidth((current) => {
          if (current >= 90) return current;
          const step = current < 50 ? 10 : 3;
          return Math.min(current + step, 90);
        });
      }, 200);
    }

    stallRef.current = window.setTimeout(finish, 30000);
  };

  const finishRef = useRef(finish);
  const startRef = useRef(start);
  finishRef.current = finish;
  startRef.current = start;

  useEffect(() => {
    if (pathnameRef.current === pathname) return;
    pathnameRef.current = pathname;
    finishRef.current();
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (!isInternalNavigation(anchor, event)) return;
      startRef.current();
    };

    const onPopState = () => {
      startRef.current();
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
      stopTrickle();
      if (stallRef.current !== null) window.clearTimeout(stallRef.current);
      if (hideRef.current !== null) window.clearTimeout(hideRef.current);
    };
  }, []);

  if (phase === "idle") return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[3px]"
      role="progressbar"
      aria-hidden="true"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(width)}
    >
      <div
        className={`h-full bg-annict-100 shadow-[0_0_8px_#d51c5b] transition-[width,opacity] duration-200 ease-out motion-reduce:transition-none ${phase === "done" ? "opacity-0" : "opacity-100"}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
