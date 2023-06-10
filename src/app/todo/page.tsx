import LayoutContainer from '~/components/layouts/Container';

export const metadata = {
  title: 'やり残しと更新履歴',
};

export default function Todo() {
  return (
    <LayoutContainer>
      <h1 className="mb-8 px-4 py-3 pt-1 sm:py-3 text-center text-lg font-bold border-b dark:border-white/25">やり残しと更新履歴</h1>

      <section className="mt-8 px-4">
        <h2 className="text-lg font-bold">やり残しTODO</h2>
        <ul className="list-disc mt-2 ml-6">
          <li>画像の取得を cdn.myanimelist.net へ変更する。</li>
          <li>パフォーマンスを上げる…。</li>
        </ul>
      </section>

      <section className="mt-8 px-4">
        <h2 className="text-lg font-bold">やりたかったけどできなかったこと</h2>
        <ul className="list-disc mt-2 ml-6">
          <li>他の人のエピソードの記録に対して、いいねを押したかったが API がなかったので断念しました。</li>
        </ul>
      </section>

      <section className="mt-8 px-4">
        <h2 className="text-lg font-bold">確認している不具合</h2>
        <ul className="list-disc mt-2 ml-6">
          <li>Annict でスキップをすると次のエピソードの取得が上手くいかないかもしれません。</li>
        </ul>
      </section>
      
      <section className="mt-8 px-4">
        <h2 className="text-lg font-bold">更新履歴</h2>
        <div>
          {[
            {
              date: '2023/06/10 (土)',
              comments: [
                'エピソード画面からブラウザバックした際にスクロールが出来なくなる現象を解消しました。',
              ]
            },
            {
              date: '2023/06/08 (木)',
              comments: [
                '詳細画面のチャンネルへのリンクが正確に取れないので名前だけ表示するようにしました。',
                '詳細画面をID指定で直接開いた場合かつ視聴ステータスが未選択でも表示されるようにしました。',
              ]
            },
            {
              date: '2023/06/07 (水)',
              comments: [
                'エピソード記録の削除の際に確認を行うようにしました。',
                'コメントが入力されている際に離脱確認を行うようにしました。',
              ]
            },
            {
              date: '2023/06/06 (火)',
              comments: [
                'リリースしました。',
              ]
            }
          ].map((update, updateIndex) => (
            <dl key={updateIndex} className="mt-2">
              <dt className="font-bold">{update.date}</dt>
              <dd>
                <ul className="list-disc mt-1 ml-6">
                  {update.comments.map((comment, commentIndex) => <li key={`${updateIndex}-${commentIndex}`}>{comment}</li>)}
                </ul>
              </dd>
            </dl>
          ))}
        </div>
      </section>
    </LayoutContainer>
  );
}