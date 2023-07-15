# Sava Lang（鯖言語）

My First Toy Language

インタプリタのお勉強で作っただけ

ほぼなにもできない

## 試してみる

### [デモ実行環境](https://ess2021.github.io/Sava-Lang/demo.html)

なぜか固まる時がある。ちゃんと動かしたい方はNode.jsかGoogle Apps Script使ってください。

## サンプルコード

- Hello world
  ```py
  << "Hello, world!"
  ```
- カウンター
  ```py
  sava n as number
  n = 10 # カウント数
  sava i as number
  i = 0 # ループ変数

  !loop:
      i++
      << i # 出力
      if i < n then goto loop

  !end:
  ```

### [その他サンプルコード](https://github.com/Ess2021/Sava-Lang/tree/main/samples)

## 使い方
まずインタプリタのjsをすべてインポート

```javascript
let code = `
<< "Hello, world!"
`;
const interpreter = new SavaInterpreter();
interpreter.run(code);
```

# ドキュメント（もどき）

## データ型

- `number`型：数値
- `string`型：文字列

だけー

## 標準出力

```py
<< "文字列"
```

生のJavaScriptで作ったせいで標準入力はないです

## 変数

### 宣言

```py
sava <変数名> as <データ型>
```

### 代入

```py
sava n as number
sava str as string
n = 57 # nに代入
str = "hogehoge" # strに代入
```

### その他

```py
sava a as number
sava b as number
a = 0
b = 2
a++ # インクリメント
b-- # デクリメント
a += 5 # 5を足す
b -= a # aを引く

sava str as string
str = "hello, "
str += "world!" # 文字列結合
```

## ラベルとジャンプ

### ラベル宣言

```py
!<ラベル名>:
```

### ジャンプ（goto文）

```py
!myLabel:
    # なんかやる

goto myLabel
goto hoge # 後ろにもジャンプできる

!hoge:
```

## if文

```py
if <条件> then <goto文>
```

### 例

```py
sava age as number
age = 18

if age >= 18 then goto end

<< "ようこそxxxへ！"

!end:
```
