from flask import request
from model.form_value import FormValue
from lib.plot import showAll, showSingle
from pyMEA.MEA import MEA
import numpy as np
import json


def decode_request():
    # POSTされたファイルデータを取得
    files = request.files.values()
    data = np.array([np.frombuffer(file.read(), dtype=np.float32) for file in files])

    json_data = request.form.get("jsonData")
    if json_data:
        json_data = json.loads(json_data)  # JSON文字列をPython辞書に変換

    return data, json_data


def showAllService() -> str:
    data, json_data = decode_request()

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


def showSingleService() -> str:
    data, json_data = decode_request()
    x, y = data[0], data[1]

    value = FormValue(
        json_data["start"],
        json_data["end"],
        json_data["volt_min"],
        json_data["volt_max"],
        json_data["x_ratio"],
        json_data["y_ratio"],
        json_data["dpi"],
    )
    image = showSingle(
        x,
        y,
        value.start,
        value.end,
        value.volt_min,
        value.volt_max,
        (value.x_ratio, value.y_ratio),
        value.dpi,
    )

    return image
