# get-slack-icons

## Slack の workspace のメンバー一覧を取得する

基本的に1度実行すれば十分

```bash
$ node --loader ts-node/esm src/fetch-members.ts
```

## ダウンロードしたいメンバーを指定する

- `names.txt` を更新する
- `rm -rf icons` で一度削除してから再度ダウンロードする

## アイコンをダウンロードする

```bash
$ node --loader ts-node/esm src/download-icons.ts
```
