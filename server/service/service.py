from flask import request
from model.form_value import FormValue
from lib.plot import showAll
from pyMEA.MEA import MEA
import numpy as np
import json


def showAllService() -> str:
    # POSTされたファイルデータを取得
    files = request.files.values()
    data = np.array([np.frombuffer(file.read(), dtype=np.float32) for file in files])

    json_data = request.form.get("jsonData")
    if json_data:
        json_data = json.loads(json_data)  # JSON文字列をPython辞書に変換
    value = FormValue(
        json_data["start"],
        json_data["end"],
        json_data["volt_min"],
        json_data["volt_max"],
        json_data["x_ratio"],
        json_data["y_ratio"],
        json_data["dpi"],
    )
    image = showAll(
        data,
        value.start,
        value.end,
        value.volt_min,
        value.volt_max,
        figsize=(value.x_ratio, value.y_ratio),
        dpi=value.dpi,
    )

    return image
