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

      <section className="mt-8 px-4">
        <h2 className="text-lg font-bold">1. Annict でチャンネル一覧からチャンネルを設定してください。</h2>
        <p><a href="https://annict.com/channels" target="_blank" rel="noopener noreferrer"><Icons className="inline mr-1" id="open_in_new" type="link" />https://annict.com/channels</a></p>
      </section>

      <section className="mt-8 px-4">
        <h2 className="text-lg font-bold">2. Annict で番組情報からチャンネルを設定してください。</h2>
        <p className="mt-1"><Image src="/howto-channle.jpg" alt="" width={630} height={486} /></p>
      </section>

      <section className="mt-8 px-4">
        <h2 className="text-lg font-bold">3. Annict で視聴ステータスを設定してください。</h2>
        <p className="mt-1"><Image src="/howto-state.jpg" alt="" width={278} height={667} /></p>
      </section>

      <section className="mt-8 px-4">
        <h2 className="text-lg font-bold">4. 以上</h2>
        <p>設定いただきありがとうございました。<br />これでアニメリストが取得できるようになりました。</p>
      </section>
    </LayoutContainer>
  );
}