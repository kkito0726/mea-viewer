# MEA Viewer

MEA 計測データをブラウザ上で確認するアプリ

## 1. 環境構築

アプリケーションを docker-compose で動かす。

### Windows OS の場合

1. [Git install](https://qiita.com/T-H9703EnAc/items/4fbe6593d42f9a844b1c)
2. [Docker Desktop install](https://docs.docker.com/get-docker/)
3. git bash (Git インストール時に同時に入る)で以下のコマンドを実行

初回のみ

```bash
mkdir ~/Workspace
cd ~/Workspace
git clone https://github.com/kkito0726/mea-viewer
cd mea-viewer
bash ~/Workspace/mea-viewer/win-setup.sh
```

### Mac OS の場合

1. [Docker Desktop install](https://docs.docker.com/get-docker/)
2. ターミナルで以下のコマンドを実行

初回のみ

```bash
mkdir ~/Workspace
cd ~/Workspace
git clone https://github.com/kkito0726/mea-viewer
bash ~/Workspace/mea-viewer/mac-setup.sh
```

## 2. アプリの実行

Docker Desktop を起動した状態で

```bash
mea-viewer
```

このコマンドで Docker コンテナが立ち上がり、ブラウザが開く。
PC 再起動や Docker Desktop を再起動した場合はこのコマンドをもう一度実行する。

### Docker コンテナを停止したい場合

```bash
docker-compose -f ~/Workspace/mea-viewer/docker-compose.yml stop
```

## 3. アプリのアップデートをする場合

ローカルリポジトリを最新版にして、docker コンテナを build する

```bash
cd ~/Workspace/mea-viewer
docker-compose build
```

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
