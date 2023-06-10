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
- 他の人のエピソードの記録に対して、いいねを押したかったが API がなかったので断念しました。

## スクリーンショット
### トップページ
![スクリーンショット 2023-06-07 161701](https://github.com/mhkkr/animita/assets/5414631/4e3546fc-6b99-4e3b-ab83-5c70d1a89a70)
### エピソード一覧
![スクリーンショット 2023-06-10 214018](https://github.com/mhkkr/animita/assets/5414631/35c5f626-99d0-49f3-95ca-3de60e0c0499)
### 記録する
![スクリーンショット 2023-06-10 213921](https://github.com/mhkkr/animita/assets/5414631/e1a10671-1757-4015-9490-1f8502fca2ab)
### スマホトップページ
![スクリーンショット 2023-06-10 214116](https://github.com/mhkkr/animita/assets/5414631/00bc5a72-5ae5-4bf4-bef4-85d7a70651ca)
