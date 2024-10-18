# Source Code Comment Translator

ソースコードのコメントを翻訳するWEBアプリ。

ソースコードを解析し、コメントのみを取り出し、外部の翻訳サイトで翻訳する。
また、複数行に渡るコメントの場合は、改行を削除して外部サイトで翻訳しやすいように整形する。

[こちら](https://ytgw.github.io/CodeCommentTranslator)から利用可能。

以下はよく使うコマンド。

- ```npm start``` 開発用サーバーの起動
- ```npm run build``` プロダクション用にビルド
- ```npm run serve``` プロダクション用ビルドをローカルでプレビュー
- ```npm test``` テストの実行
- ```npx eslint --fix src/``` srcディレクトリ以下に対してリント
