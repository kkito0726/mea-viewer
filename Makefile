.PHONY: dev build up down pull logs clean rebuild

# 開発用：ローカルでビルドして起動
dev:
	docker compose -f docker-compose.yml -f docker-compose.build.yml up -d --build

# ビルドのみ（起動しない）
build:
	docker compose -f docker-compose.yml -f docker-compose.build.yml build

# 本番用：イメージをpullして起動
up:
	docker compose up -d

# コンテナ停止
down:
	docker compose down

# 最新イメージを取得
pull:
	docker compose pull

# ログ表示
logs:
	docker compose logs -f

# pyMEAを最新版にしてビルド
rebuild-server:
	docker compose -f docker-compose.yml -f docker-compose.build.yml build --no-cache server

# 全てクリーンアップ（データも削除）
clean:
	docker compose down -v
	docker rmi mea-viewer-server mea-viewer-client mea-viewer-go-backend 2>/dev/null || true
