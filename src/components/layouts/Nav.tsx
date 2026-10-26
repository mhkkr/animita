"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Icons from "~/components/icons/Icons";
import Const from "~/constants";
import { libraryTabHref } from "~/libs/libraryTab";

const NAV_ITEMS = [
  { href: "/", label: "視聴中", icon: "tv", match: (pathname: string) => pathname === "/" || pathname.startsWith("/anime/") },
  { href: "/find", label: "見つける", icon: "explore", match: (pathname: string) => pathname === "/find" || pathname.startsWith("/find/") },
  { href: "/search", label: "検索", icon: "search", match: (pathname: string) => pathname === "/search" || pathname.startsWith("/search/") },
  { href: libraryTabHref(Const.STATUS_STATE_LIST[0].id), label: "ライブラリ", icon: "library", match: (pathname: string) => pathname === "/library" || pathname.startsWith("/library/") },
  { href: "/mypage", label: "マイページ", icon: "person", match: (pathname: string) => pathname === "/mypage" || pathname.startsWith("/mypage/") },
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
                  relative flex items-center justify-center sm:justify-normal p-3 w-full text-xl
                  ${active ? "font-bold" : "dark:text-white/70"}
                `}
              >
                <Icons id={active ? item.icon : `${item.icon}_outline`} type="navigation" className="text-[1.5em] sm:mr-2.75" />
                <span className="hidden sm:block">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
