# アニみた

## ロゴ
Annict のロゴの「A」と漢字の「見」を掛け合わせてみました。

## 紹介
主に配信サイト勢向けにすぐ見れるアニメと次の予定を分かりやすく把握し、ちょっとだけアニメライフの充実に貢献できればと思い開発しました。  
PWA に対応しており、スマホアプリのように使うことができます！  
データの取得には Annict の GraphQL API を使っています。  
ユーザー認証は OAuth を使っています。  
（iPhone の safari でホームに追加した場合は、メールリンクログインだと使用できないかもしれません）

## 以下のことができます
- アニメのステータス変更
- エピソードの記録（コメント、評価、変更、削除）
- 他の人のエピソードの記録の閲覧

## やり残しTODO
- 画像の取得を cdn.myanimelist.net へ変更する。（今は公式サイトの og:image が Annict の API で取れるので使っているがいいのだろうか？）
- パフォーマンスを上げる…。

## やりたかったけどできなかったこと
- 他の人のエピソードの記録に対して、いいねを押したかったが API がなかったので断念した。

## スクリーンショット
![スクリーンショット 2023-06-07 161701](https://github.com/mhkkr/animita/assets/5414631/4e3546fc-6b99-4e3b-ab83-5c70d1a89a70)
