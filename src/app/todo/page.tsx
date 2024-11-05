import LayoutContainer from '~/components/layouts/Container';

export const metadata = {
  title: '更新履歴',
};

const updates = [
  {
    date: '2024/11/4 (月)',
    comments: [
      '設定ページから MyAnimeList のキャッシュを削除するボタンを作りました。何か不具合があればこちらを押してください。',
    ]
  },
  {
    date: '2024/11/3 (日)',
    comments: [
      '各種ライブラリを最新のものに変更しましたVer2（特に NextJS14 → 15 へ。また Recoil → Jotai へ移行）。',
      'ミュートページを設定ページに変更。他人の評価についての表示の設定を追加。',
      '通信を少なくするために MyAnimeList から取得する画像URLと全話数をローカルストレージへ保存するようにしました。',
      'エピソード記録画面でテキストエリアにフォーカスする動作をPCのみにしました。',
    ]
  },
  {
    date: '2024/10/30 (水)',
    comments: [
      'ApolloClient のキャッシュ設定を最適化。',
      '作品画像が取得できない場合は MyAnimeList の画像を取得するようにしました。',
      'エピソード一覧にて全話数の表示を追加しました。',
      'エピソード記録時にみんなの評価が変動しない不具合を訂正。',
      'Annict のユーザーページへのリンクの設置場所をパネル内に移動しました。',
    ]
  },
  {
    date: '2024/10/28 (月)',
    comments: [
      'マイページにプロフィールページを追加しました。',
    ]
  },
  {
    date: '2024/10/26 (土)',
    comments: [
      'エピソード履歴に評価を表示しました。',
      'エピソード記録一覧を評価が良い順かつライクが多い順から表示するように変更しました。',
    ]
  },
  {
    date: '2024/10/24 (木)',
    comments: [
      'エピソード記録画面でユーザーアイコン及び名前から Annict のユーザーページへのリンクを設置しました。',
    ]
  },
  {
    date: '2024/10/23 (水)',
    comments: [
      'マイページ（エピソード履歴とミュート）を追加しました。',
      'エピソード記録画面でユーザーのミュートを行えるようにしました。',
    ]
  },
  {
    date: '2024/10/21 (月)',
    comments: [
      '各種ライブラリを最新のものに変更しました。',
      'エピソード記録画面で評価を集計したみんなの評価を追加しました。',
    ]
  },
  {
    date: '2024/10/20 (日)',
    comments: [
      'エピソード記録画面を開いた時に未記録の場合、テキストエリアにフォーカスするようにしました。',
      'エピソード記録画面で原作・監督・制作・キャストを表示するボタンを追加しました。',
    ]
  },
  {
    date: '2023/06/12 (月)',
    comments: [
      'ホワイトモードの時に閲覧しにくい状況を回避しました。',
    ]
  },
  {
    date: '2023/06/11 (日)',
    comments: [
      '原作、監督、制作の情報を表示できるようにしました。',
    ]
  },
  {
    date: '2023/06/10 (土)',
    comments: [
      'キャスト情報を表示できるようにしました。',
      'エピソード記録の投稿時のツイッター連携は意味がないみたいなので削除しました。それにともなって自身の記録にシェアボタンを設置し、つぶやけるようにしました。',
      'エピソード記録画面からブラウザバックした際にスクロールが出来なくなる現象を解消しました。',
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
];

export default function Todo() {
  return (
    <LayoutContainer>
      <h1 className="mb-8 px-4 py-3 pt-1 sm:py-3 text-center text-lg font-bold border-b dark:border-stone-700">{metadata.title}</h1>

      <section className="mt-8 px-4">
        <h2 className="text-lg font-bold">やりたかったけどできなかったこと</h2>
        <ul className="list-disc mt-2 ml-6">
          <li>他の人のエピソードの記録に対して、いいねを押したかったが API がなかったので断念しました。</li>
        </ul>
      </section>
      
      <section className="mt-8 px-4">
        <h2 className="text-lg font-bold">更新履歴</h2>
        {updates.map((update, updateIndex) => (
          <dl key={updateIndex} className="mt-2">
            <dt className="font-bold">{update.date}</dt>
            <dd>
              <ul className="list-disc mt-1 ml-6">
                {update.comments.map((comment, commentIndex) => <li key={`${updateIndex}-${commentIndex}`}>{comment}</li>)}
              </ul>
            </dd>
          </dl>
        ))}
      </section>
    </LayoutContainer>
  );
}