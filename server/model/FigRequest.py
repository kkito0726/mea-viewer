import json
from dataclasses import dataclass
from trace import Trace

import numpy as np
from flask import request


@dataclass(frozen=True)
class FigRequest:
    data: np.ndarray[float]
    json_data: dict


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

    volt = np.array([row[~np.isnan(row)] for row in data[1:]])
    t = data[0][: len(volt[0])]
    t = t.reshape(1, len(t))
    return np.append(t, volt, axis=0)
