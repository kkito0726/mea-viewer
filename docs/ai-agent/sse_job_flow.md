# Flask バックエンドでの SSE ＋ジョブ ID 管理による描画完了通知 実装方針

## 概要

- クライアントが描画リクエストを送信すると、サーバーはジョブ ID を発行し、描画処理を非同期で実行。
- クライアントはジョブ ID を使って SSE エンドポイントに接続し、描画完了通知や結果をリアルタイムで受信。
- 最終的に `FigUseCase(fig_request).create_fig()` の戻り値がクライアントに送信される。

---

## エンドポイント設計

### 1. `/draw` (POST)

- 描画リクエストを受け付け、ジョブ ID を発行。
- 描画処理は非同期で実行。
- レスポンス例: `{ "job_id": "xxxx-xxxx-xxxx" }`

### 2. `/draw/stream/<job_id>` (GET, SSE)

- クライアントはこのエンドポイントに SSE で接続。
- 指定ジョブ ID の描画完了時に、`FigUseCase(fig_request).create_fig()` の戻り値を送信。

---

## 実装例（Python/Flask）

### グローバルなジョブ管理

```python
jobs = {}  # {job_id: {"status": "pending"|"done", "result": ...}}
```

### `/draw` エンドポイント

```python
@figure.route("/draw", methods=["POST"])
def draw():
    fig_request = decode_request()
    job_id = str(uuid.uuid4())
    jobs[job_id] = {"status": "pending", "result": None}
    threading.Thread(target=background_draw, args=(fig_request, job_id)).start()
    return jsonify({"job_id": job_id}), 202

def background_draw(fig_request, job_id):
    result = FigUseCase(fig_request).create_fig()
    jobs[job_id] = {"status": "done", "result": result}
```

### `/draw/stream/<job_id>` SSE エンドポイント

```python
@figure.route("/draw/stream/<job_id>")
def draw_stream(job_id):
    def event_stream():
        while True:
            job = jobs.get(job_id)
            if job and job["status"] == "done":
                data = job["result"]
                if not isinstance(data, str):
                    data = json.dumps(data, ensure_ascii=False)
                yield f"data: {data}\n\n"
                break
            time.sleep(1)
    return Response(stream_with_context(event_stream()), mimetype="text/event-stream")
```

---

## 注意点

- ジョブ管理はメモリ上で行うため、サーバー再起動で消えます。本番運用では Redis 等の永続ストア推奨。
- 複数ユーザーや大量ジョブ対応時は、ジョブ ID の管理・クリーンアップも考慮。
- SSE は開発サーバーではなく、gunicorn+gevent 等の本番 WSGI サーバーで運用推奨。
- クライアント側は SSE で受信したデータをパースして利用。

---

## クライアント側（例: JavaScript）

```js
const eventSource = new EventSource(`/draw/stream/${job_id}`);
eventSource.onmessage = function (event) {
  const result = JSON.parse(event.data);
  // ここで描画結果を処理
  eventSource.close();
};
```

---

## フロントエンド（React）側の修正方針

### 1. `/draw` へのリクエストで job_id を受け取る

- これまでの `ImgResponse[]` ではなく、`{ job_id: string }` を受け取るように `fetchCreateFigure` を修正。

### 2. SSE で `/draw/stream/<job_id>` に接続し、描画完了データを受信

- `EventSource` を使い、サーバーからの描画完了通知をリアルタイムで受信。
- 受信データは `setImageResponses` などで state に格納。

### 3. 実装例（handleFetch の修正）

```typescript
const resData = await fetchCreateFigure(...);
if (resData && resData.job_id) {
  const eventSource = new EventSource(`${FLASK_ROOT_URL}/draw/stream/${resData.job_id}`);
  eventSource.onmessage = (event) => {
    const result = JSON.parse(event.data);
    setImageResponses((prev) => [...prev, result]);
    eventSource.close();
  };
  eventSource.onerror = (e) => {
    console.error('SSE error:', e);
    eventSource.close();
  };
}
```

### 4. 注意点

- サーバー側の `/draw` レスポンス形式・SSE のエンドポイント URL と合わせること。
- 受信データの型（JSON 等）に注意。
- 複数リクエスト時の state 管理やエラー処理も考慮。

---

# Flask ＋ SSE ＋ジョブ ID 管理による描画完了通知 実装まとめ

## 概要

- クライアントが描画リクエストを送信すると、サーバーはジョブ ID を発行し、描画処理を非同期で実行。
- クライアントはジョブ ID を使って SSE エンドポイントに接続し、描画完了通知や結果をリアルタイムで受信。
- 最終的に `FigUseCase(fig_request).create_fig()` の戻り値（dict のリスト）がクライアントに送信される。

---

## サーバー側（Flask）

### 1. ジョブ管理

- グローバル変数 `jobs = {}` でジョブ ID ごとに状態・結果を管理。
- 本番運用では Redis 等の永続ストア推奨。

### 2. `/draw` エンドポイント

- リクエスト受付時にジョブ ID を発行し、非同期スレッドで描画処理を開始。
- レスポンス例: `{ "job_id": "xxxx-xxxx-xxxx" }`

```python
@figure.route("/draw", methods=["POST"])
def draw():
    fig_request = decode_request()
    job_id = str(uuid.uuid4())
    jobs[job_id] = {"status": "pending", "result": None}
    threading.Thread(target=background_draw, args=(fig_request, job_id)).start()
    return jsonify({"job_id": job_id}), 202
```

### 3. 非同期描画処理

- Flask アプリケーションコンテキストを明示的に有効化する必要あり。
- 戻り値は「dict のリスト」にする。

```python
def background_draw(fig_request, job_id):
    from app import app
    with app.app_context():
        result = FigUseCase(fig_request).create_fig()  # dictのリストを返す
        jobs[job_id] = {"status": "done", "result": result}
```

### 4. `/draw/stream/<job_id>` SSE エンドポイント

- ジョブ完了時に dict のリストを JSON 文字列で送信。

```python
@figure.route("/draw/stream/<job_id>")
def draw_stream(job_id):
    def event_stream():
        while True:
            job = jobs.get(job_id)
            if job and job["status"] == "done":
                data = job["result"]
                if not isinstance(data, str):
                    data = json.dumps(data, ensure_ascii=False)
                yield f"data: {data}\n\n"
                break
            time.sleep(1)
    return Response(stream_with_context(event_stream()), mimetype="text/event-stream")
```

### 5. FigImage モデル・リポジトリ

- Marshmallow の Schema で dict 化するのが推奨。

```python
class FigImageRepository:
    @staticmethod
    def insert(fig_image: FigImage):
        res = fig_image.create_image()
        return FigImageSchema().dump(res)
```

---

## クライアント側（React）

### 1. `/draw` で job_id を受け取る

- fetchCreateFigure の返り値を `{ job_id: string }` に修正。

### 2. SSE で描画完了データを受信

- EventSource で `/draw/stream/${job_id}` に接続し、受信データを state に格納。

```typescript
const resData = await fetchCreateFigure(...);
if (resData && resData.job_id) {
  const eventSource = new EventSource(`${FLASK_ROOT_URL}/draw/stream/${resData.job_id}`);
  eventSource.onmessage = (event) => {
    const result = JSON.parse(event.data);
    setImageResponses((prev) => [...prev, ...result]);
    eventSource.close();
  };
  eventSource.onerror = (e) => {
    console.error('SSE error:', e);
    eventSource.close();
  };
}
```

---

## エラー対応・注意点

- Flask のスレッドで DB 操作する場合は `with app.app_context():` が必須。
- SSE で送るデータは必ず「dict/list」→`json.dumps()`で文字列化。
- Marshmallow の Schema を使えば datetime も自動で文字列化される。
- クライアントは `JSON.parse(event.data)` で受信データを配列として扱う。
- 本番運用や複数プロセス対応時は永続ストア（例: Redis）推奨。

---

## まとめ

- サーバーは「ジョブ ID 管理＋ SSE ＋ dict のリスト返却」
- クライアントは「job_id で SSE 接続し、配列データを受信・state 反映」

この構成でリアルタイムな描画完了通知・結果取得が実現できます。
