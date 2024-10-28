import Link from 'next/link';

import Const from '~/constants';

export default function MyHeader({ pageId }: { pageId: string }) {
  return (
    <header className="z-10 sticky top-0 dark:bg-black/60 backdrop-blur-md">
      <h1 className="flex items-center justify-center px-4 py-3 text-xl font-bold">
        マイページ
      </h1>
      <nav className="flex border-b dark:border-stone-700">
        {Const.MY_PAGES.map(page => {
          return (
            <Link
              key={`mypage-menu-${page.id}`}
              className={`
                relative w-full px-4 py-3 text-center
                after:content-[''] after:block after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-1 after:bg-annict-100 after:rounded-full
                ${page.id === pageId ? 'font-bold' : 'dark:text-white/70 after:hidden'}
              `}
              href={`/mypage${page.path}`}
              aria-current={page.id === pageId ? 'page' : undefined}
            >
              {page.title}
            </Link>
          )
        })}
      </nav>
    </header>
  );
}