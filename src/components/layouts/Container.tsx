import Link from 'next/link';

import Header from './Header';
import Footer from './Footer';

export default function LayoutContainer({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="sm:px-4 pb-14 sm:pb-0">
      <div className="min-h-screen max-w-4xl mx-auto sm:flex">
        <Header className="w-full sm:w-48" />
        <div className="flex-1 flex flex-col lg:flex-row sm:border-l sm:border-r lg:border-r-0 dark:border-stone-700">
          <main className="flex-1 lg:border-r dark:border-stone-700 pb-12">
            {children}
          </main>
          <div className="relative lg:w-48 px-4 lg:pr-0">
            <div className="lg:sticky lg:top-0 lg:h-screen lg:flex lg:flex-col">
              <div className="mt-auto">
                <aside className="mb-4">
                  <ul className="grid grid-rows-2 lg:grid-rows-1 gap-3">
                    <li><Link className="block text-xs text-center dark:text-white/70 py-3 px-2 rounded border dark:border-stone-700" href="/mypage">マイページ</Link></li>
                    <li><Link className="block text-xs text-center dark:text-white/70 py-3 px-2 rounded border dark:border-stone-700" href="/howto">初期設定</Link></li>
                    <li><Link className="block text-xs text-center dark:text-white/70 py-3 px-2 rounded border dark:border-stone-700" href="/todo">更新履歴</Link></li>
                  </ul>
                </aside>
                <Footer className="mb-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}