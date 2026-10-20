import Image from 'next/image';

import LayoutContainer from '~/components/layouts/Container';
import Icons from '~/components/icons/Icons';

export const metadata = {
  title: '初期設定',
};

export default function HowTo() {
  return (
    <LayoutContainer>
      <h1 className="mb-8 px-4 py-3 pt-1 sm:py-3 text-center text-lg font-bold border-b dark:border-stone-700">{metadata.title}</h1>

      <ol className="grid gap-8 pr-4 pl-8 list-decimal">
        <li>
          <h2 className="text-lg font-bold">Annict でチャンネル一覧からチャンネルを設定してください。</h2>
          <div className="mt-2 -ml-4">
            <p><a className="hover:underline" href="https://annict.com/channels" target="_blank" rel="noopener noreferrer"><Icons className="inline -mt-0.5 mr-1" id="open_in_new" type="link" />https://annict.com/channels</a></p>
          </div>
        </li>
        <li>
          <h2 className="text-lg font-bold">Annict で視聴ステータスを設定してください。</h2>
          <div className="mt-2 -ml-4">
            <p><Image src="/howto-state.jpg" alt="" width={278} height={667} /></p>
          </div>
        </li>
        <li>
          <h2 className="text-lg font-bold">Annict で番組情報からチャンネルを設定してください。</h2>
          <div className="mt-2 -ml-4">
            <p><Image src="/howto-channle.jpg" alt="" width={630} height={486} /></p>
          </div>
        </li>
        <li>
          <h2 className="text-lg font-bold">以上</h2>
          <div className="mt-2 -ml-4">
            <p>これにて設定が完了です。<br />アニメリストが取得できるようになりました。</p>
            <dl className="mt-4 pt-4 border-t">
              <dt className="font-bold">「放送情報なし」に表示される場合</dt>
              <dd className="mt-2">Annict API の nextProgram が取得できない作品は、「視聴中」の「放送情報なし」に表示されます。<br />Annict にて一度記録を作ると、以降は放送情報が付いて通常どおり表示されることがあります。</dd>
            </dl>
          </div>
        </li>
      </ol>
    </LayoutContainer>
  );
}