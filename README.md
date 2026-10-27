# アニみた

## ロゴ
Annict のロゴの「A」と漢字の「見」を掛け合わせたデザインにしました。

## 紹介
主に「配信サイト勢向け」に今すぐ見れるアニメと週間予定を分かりやすく提供し、感想を書く一助になれば！と思い開発しました。  
PWA に対応しており、スマホアプリのように使うことができます。  
データ取得には Annict の GraphQL API を使っています。  
ユーザー認証は OAuth を使っています。  
画像は MyAnimeList API とアニメ公式サイトの OGP を利用させていただいております。

## 以下のことができます
- アニメの視聴ステータスを変更
- アニメへの記録とエピソード毎の記録（コメント、評価、変更、削除）
- アニメごとに付けられている他のユーザーの記録の閲覧
- みんなの評価を集計し表示
- 季節ごとのアニメを検索
- アニメタイトルで検索
- 履歴などのマイページの提供

## TODO
- 他の人のエピソードの記録に対して、いいねを押したい（現状 API がないので断念中 >_<）

## スクリーンショット
### 視聴中
<p><img src="public/screenshot/top-pc.png" alt="視聴中" width="72%"> <img src="public/screenshot/top-sp.png" alt="視聴中（スマホ）" width="24%"></p>

### アニメ詳細
<p><img src="public/screenshot/anime-pc.png" alt="アニメ詳細" width="72%"> <img src="public/screenshot/anime-sp.png" alt="アニメ詳細（スマホ）" width="24%"></p>

### 記録する
<p><img src="public/screenshot/episode-pc.png" alt="記録する" width="72%"> <img src="public/screenshot/episode-sp.png" alt="記録する（スマホ）" width="24%"></p>

### 見つける
<p><img src="public/screenshot/works-pc.png" alt="見つける" width="72%"> <img src="public/screenshot/works-sp.png" alt="見つける（スマホ）" width="24%"></p>

### 履歴
<p><img src="public/screenshot/history-pc.png" alt="履歴" width="72%"> <img src="public/screenshot/history-sp.png" alt="履歴（スマホ）" width="24%"></p>
