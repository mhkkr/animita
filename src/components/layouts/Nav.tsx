"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Icons from "~/components/icons/Icons";

const NAV_ITEMS = [
  { href: "/", label: "視聴可能", icon: "play", match: (pathname: string) => pathname === "/" || pathname.startsWith("/anime/") },
  { href: "/list", label: "週間予定", icon: "calendar", match: (pathname: string) => pathname === "/list" || pathname.startsWith("/list/") },
  { href: "/mypage", label: "ユーザー", icon: "person", match: (pathname: string) => pathname === "/mypage" },
  { href: "/mypage/records", label: "履歴", icon: "history", match: (pathname: string) => pathname.startsWith("/mypage/records") },
  { href: "/mypage/setting", label: "設定", icon: "settings", match: (pathname: string) => pathname.startsWith("/mypage/setting") },
] as const;

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t sm:border-t-0 dark:border-stone-700 dark:bg-black/60 backdrop-blur-md sm:bg-inherit sm:backdrop-blur-none sm:static">
      <ul className="grid grid-cols-5 sm:block">
        {NAV_ITEMS.map((item) => {
          const active = item.match(pathname);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`
                  relative flex items-center justify-center sm:justify-normal p-3 w-full text-xl sm:rounded-l-3xl
                  sm:after:content-[''] sm:after:block sm:after:absolute sm:after:inset-0 sm:after:border sm:after:border-r-0 dark:sm:after:border-white/25 sm:after:rounded-l-3xl
                  ${active ? "font-bold" : "sm:after:hidden dark:text-white/70"}
                  sm:focus-visible:outline-none sm:focus-visible:after:block sm:focus-visible:dark:after:border-white
                `}
              >
                <Icons id={item.icon} type="navigation" className="text-[1.5em] sm:mr-2.75" />
                <span className="hidden sm:block">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
