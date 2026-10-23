"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Icons from "~/components/icons/Icons";

const NAV_ITEMS = [
  { href: "/", label: "視聴中", icon: "tv", match: (pathname: string) => pathname === "/" || pathname.startsWith("/anime/") },
  { href: "/mypage", label: "ユーザー", icon: "person", match: (pathname: string) => pathname === "/mypage" },
  { href: "/mypage/records", label: "履歴", icon: "history", match: (pathname: string) => pathname.startsWith("/mypage/records") },
  { href: "/mypage/setting", label: "設定", icon: "settings", match: (pathname: string) => pathname.startsWith("/mypage/setting") },
] as const;

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t sm:border-t-0 dark:border-stone-700 dark:bg-black/60 backdrop-blur-md sm:bg-inherit sm:backdrop-blur-none sm:static">
      <ul className="grid grid-cols-4 sm:block">
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
