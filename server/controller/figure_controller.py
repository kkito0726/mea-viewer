import json
import threading
import time
import uuid

from flask import Blueprint, Response, jsonify, stream_with_context
from model.FigRequest import decode_request
from usecase.FigUseCase import FigUseCase

figure = Blueprint("figure", __name__)

jobs = {}


@figure.route("/draw", methods=["POST"])
def draw():
    fig_request = decode_request()
    job_id = str(uuid.uuid4())
    jobs[job_id] = {"status": "pending", "result": None}
    threading.Thread(target=background_draw, args=(fig_request, job_id)).start()
    return jsonify({"job_id": job_id}), 202


def background_draw(fig_request, job_id):
    from app import app

    with app.app_context():
        result = FigUseCase(fig_request).create_fig()
        jobs[job_id] = {"status": "done", "result": result}


@figure.route("/draw/stream/<job_id>")
def draw_stream(job_id):
    def event_stream():
        while True:
            job = jobs.get(job_id)
            if job and job["status"] == "done":
                data = job["result"]
                # bytes型ならデコード
                if isinstance(data, bytes):
                    data = data.decode("utf-8")
                # str型でなければJSON文字列に変換
                if not isinstance(data, str):
                    data = json.dumps(data, ensure_ascii=False)
                yield f"data: {data}\n\n"
                del jobs[job_id]
                break
            time.sleep(1)

    return Response(
        stream_with_context(event_stream()),
        mimetype="text/event-stream",
    )
