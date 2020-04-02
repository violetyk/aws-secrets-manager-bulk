# aws-secrets-manager-bulk

`path/to/basename` を シークレット名としてシークレットを一度に作成する


```sh
$ yarn run create-secrets --path "./secrets/path/to/dir/*.json"
```

```sh
$ yarn run create-secrets --path "./secrets/path/to/dir/*.json" --force
```


ランダムパスワードの生成

```sh
$ yarn run random-password
```

ランダムパスワードの生成とpasswordの更新

```sh
$ yarn run put-secret-value --secret_name "secret/name"
```
