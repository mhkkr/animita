"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ASIDE_ITEMS = [
  { href: "/howto", label: "初期設定" },
  { href: "/update", label: "更新履歴" },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Aside() {
  const pathname = usePathname();

  return (
    <aside className="mb-4">
      <ul className="grid grid-rows-2 lg:grid-rows-1 gap-3">
        {ASIDE_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`
                  block text-xs text-center py-3 px-2 rounded border
                  ${active
                    ? "font-bold border-stone-900 dark:border-white dark:text-white"
                    : "dark:text-white/70 dark:border-stone-700"}
                `}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
