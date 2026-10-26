"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/mypage", label: "ユーザー", match: (pathname: string) => pathname === "/mypage" },
  { href: "/mypage/records", label: "履歴", match: (pathname: string) => pathname.startsWith("/mypage/records") },
  { href: "/mypage/setting", label: "設定", match: (pathname: string) => pathname.startsWith("/mypage/setting") },
] as const;

export default function MyPageTabs() {
  const pathname = usePathname();

  return (
    <div role="tablist" aria-label="マイページ" className="sticky top-0 z-10 flex border-b dark:border-white/25 bg-white/60 dark:bg-black/60 backdrop-blur-md">
      {TABS.map((item) => {
        const selected = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            role="tab"
            aria-selected={selected}
            className={`relative flex-1 px-4 py-3 text-center after:content-[''] after:block after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-1 after:bg-annict-100 after:rounded-full ${selected ? "font-bold" : "dark:text-white/70 after:hidden"}`}
            onClick={(event) => {
              if (selected) event.preventDefault();
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
