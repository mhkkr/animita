export default function Footer({ className }: { className: string }) {
  return (
    <footer className={`${className} text-xs dark:text-white/70`}>
      <p>TODO:</p>
      <ul className="mt-1 mb-6 flex lg:block flex-col items-end">
        <li className="pl-[1em] indent-[-1em]">・画像の取得を cdn.myanimelist.net へ変更する。</li>
        <li className="pl-[1em] indent-[-1em]">・スマホの引き下げて更新時に入力途中のコメントが消えるのを防止したい。</li>
      </ul>
      <ul className="flex lg:block flex-col items-end">
        <li className="pl-[1em] indent-[-1em]">※開発中の為、想定外の動作があるかもしれません。</li>
        <li className="mt-1 pl-[1em] indent-[-1em]">※Google Analytics を使用しています（<a className="text-sky-600 hover:underline" href="https://policies.google.com/technologies/partner-sites?hl=ja" target="_blank" rel="noopener noreferrer">規約</a>）。</li>
        <li className="mt-1 pl-[1em] indent-[-1em]">※ソースコードは <a className="text-sky-600 hover:underline" href="https://github.com/mhkkr/animita" target="_blank" rel="noopener noreferrer">GitHub</a> で公開しています。</li>
      </ul>
      <p className="mt-4 text-right">by <a className="text-sky-600 hover:underline" href="https://twitter.com/kakera_dev" target="_blank" rel="noopener noreferrer">@kakera_dev</a></p>
    </footer>
  );
}