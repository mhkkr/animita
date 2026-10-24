"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

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
  const barRef = useRef<HTMLDivElement>(null);
  const pathnameRef = useRef(pathname);
  const phaseRef = useRef<Phase>("idle");
  const widthRef = useRef(0);
  const trickleRef = useRef<number | null>(null);
  const stallRef = useRef<number | null>(null);
  const hideRef = useRef<number | null>(null);

  const paint = (width: number, visible: boolean) => {
    const bar = barRef.current;
    if (!bar) return;
    bar.style.width = `${width}%`;
    bar.style.opacity = visible ? "1" : "0";
  };

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
    widthRef.current = 100;
    paint(100, false);
    if (hideRef.current !== null) window.clearTimeout(hideRef.current);
    hideRef.current = window.setTimeout(() => {
      phaseRef.current = "idle";
      widthRef.current = 0;
      paint(0, false);
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
    widthRef.current = continuing && widthRef.current > 0 && widthRef.current < 100 ? widthRef.current : 12;
    paint(widthRef.current, true);

    stopTrickle();
    if (!reduceMotion) {
      trickleRef.current = window.setInterval(() => {
        if (widthRef.current >= 90) return;
        const step = widthRef.current < 50 ? 10 : 3;
        widthRef.current = Math.min(widthRef.current + step, 90);
        paint(widthRef.current, true);
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
    // state は更新しない。戻る操作は pathname の変化が先に終わるので、遅らせるとバーが残る。
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (!isInternalNavigation(anchor, event)) return;
      startRef.current();
    };

    const onPopState = () => {
      // 戻る処理が先に終わっているときは、バーを出さない。
      if (pathnameRef.current === window.location.pathname) return;
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

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[3px]" aria-hidden="true">
      <div
        ref={barRef}
        className="h-full w-0 bg-annict-100 opacity-0 shadow-[0_0_8px_#d51c5b] transition-[width,opacity] duration-200 ease-out motion-reduce:transition-none"
      />
    </div>
  );
}
