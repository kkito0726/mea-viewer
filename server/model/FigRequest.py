import json
import os
import tempfile
from dataclasses import dataclass

import numpy as np
from flask import request


@dataclass(frozen=True)
class FigRequest:
    data: np.ndarray[float]
    json_data: dict


@dataclass(frozen=True)
class NpzFigRequest:
    npz_path: str
    json_data: dict


def decode_request_npz():
    npz_file = request.files.get("npz")
    json_data = request.form.get("jsonData")
    if json_data:
        json_data = json.loads(json_data)

    tmp = tempfile.NamedTemporaryFile(suffix=".npz", delete=False)
    try:
        tmp.write(npz_file.read())
        tmp.flush()
        tmp_path = tmp.name
    finally:
        tmp.close()

    return NpzFigRequest(tmp_path, json_data)


def decode_request():
    # POSTされたファイルデータを取得
    files = request.files.values()
    data = clean_data(
        np.array([np.frombuffer(file.read(), dtype=np.float32) for file in files])
    )

    json_data = request.form.get("jsonData")
    if json_data:
        json_data = json.loads(json_data)  # JSON文字列をPython辞書に変換

    return FigRequest(data, json_data)


# 受け取った電位データからnanを取り除く
# FEで読み込むときに読み込み終了時間をデータ量より長く設定すると足りない分nanで補われる
def clean_data(data):
    if not np.isnan(data).any():
        return data

    # 各行ごとにNaNを除去
    cleaned_rows = [row[~np.isnan(row)] for row in data]

    # 結果を2次元配列に（形が揃っている前提）
    return np.vstack(cleaned_rows)
