# MEA Viewer

MEA 計測データをブラウザ上で確認するアプリ

## 1. 環境構築

フロントエンドは公開済みで、バックエンドはローカル環境で実行したいので本リポジトリをクローンして実行する。

### Windows OS の場合

1. [Python install](https://www.python.org/downloads/)
2. [Git install](https://qiita.com/T-H9703EnAc/items/4fbe6593d42f9a844b1c)
3. git bash (Git インストール時に同時に入る)で以下のコマンドを実行

初回のみ

```bash
mkdir ~/Workspace
cd ~/Workspace
git clone https://github.com/kkito0726/mea-viewer
bash ./mea-viewer/setup.sh
```

### Mac OS の場合

1. [Python install](https://qiita.com/omo_taku/items/bc97f69391b2f4627f36#%E6%96%B9%E6%B3%952-homebrew%E3%82%92%E6%B4%BB%E7%94%A8%E3%81%99%E3%82%8B)
2. ターミナルで以下のコマンドを実行

初回のみ

```bash
mkdir ~/Workspace
cd ~/Workspace
git clone https://github.com/kkito0726/mea-viewer
bash ./mea-viewer/setup.sh
```

## 2. アプリの実行

```bash
bash ~/Workspace/mea-viewer/run.sh
```

このコマンドを実行するとアプリケーションが立ち上がり、ブラウザが開く
終了する場合は`Ctrl`+`c`で終了

---

## 開発環境

### 1. フロントエンド

- Vite+React+TypeScript
- Tailwind css

#### デプロイ

- Vercel

### 2. バックエンド

- Python+Flask
- [pyMEA](https://github.com/kkito0726/MEA_modules), Matplotlib, etc...
