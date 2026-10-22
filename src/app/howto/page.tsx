import type { Metadata } from "next";
import Image from 'next/image';

import LayoutContainer from '~/components/layouts/Container';
import Icons from '~/components/icons/Icons';

const title = "初期設定";

export const metadata: Metadata = {
  title,
};

export default function HowTo() {
  return (
    <LayoutContainer>
      <h1 className="mb-8 px-4 py-3 pt-1 sm:py-3 text-center text-lg font-bold border-b dark:border-stone-700">{title}</h1>

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
            <p>これにて設定が完了です。<br />視聴中ページにてアニメが取得できるようになりました。</p>
          </div>
        </li>
      </ol>
      <dl className="mt-8 pt-8 px-4 border-t dark:border-stone-700">
        <dt className="font-bold">アニメが表示されない場合</dt>
        <dd className="mt-2">Annict API にて nextProgram が取得できない作品があります。その場合、視聴中ページの一番下の「放送情報なし」に表示します。<br />また視聴ステータスが「見た」か「視聴停止」だと表示されません（「一時中断」も表示したい場合は設定ページで変更してください）。<br />それでも表示されない場合は何らかの不具合が想定されますので、お手数ですが Annict 本体をお使いください。</dd>
      </dl>
    </LayoutContainer>
  );
}