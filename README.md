# Source Code Comment Translator

ソースコードのコメントを翻訳するWEBアプリ。

ソースコードを解析し、コメントのみを取り出し、外部の翻訳サイトで翻訳する。
また、複数行に渡るコメントの場合は、改行を削除して外部サイトで翻訳しやすいように整形する。

[こちら](https://ytgw.github.io/CodeCommentTranslator)から利用可能。

以下はよく使うコマンド。

- パッケージ更新関連
    - ```npm update``` pacakage-lock.jsonの更新
    - ```npm outdated``` pacakage.jsonの更新を確認
    - ```npm install foo@latest``` fooのインストールもしくは最新バージョンへの更新

- 開発関連
    - ```npm run lint``` リントの実行
    - ```npm test``` テストの実行
    - ```npm start``` 開発用サーバーの起動

- デプロイ関連
    - ```npm run build``` プロダクション用にビルド
    - ```npm run preview``` プロダクション用ビルドをローカルでプレビュー
    - ```npm run deploy``` GitHub Pagesにデプロイ
