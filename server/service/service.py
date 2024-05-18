from flask import request
from model.form_value import FormValue
from model.peak_form_value import PeakFormValue
from lib.plot import showAll, showSingle, showDetection, raster_plot
from lib.peak_detection import detect_peak_neg, detect_peak_pos
import numpy as np
import json


def decode_request():
    # POSTされたファイルデータを取得
    files = request.files.values()
    data = np.array([np.frombuffer(file.read(), dtype=np.float32) for file in files])

    json_data = request.form.get("jsonData")
    if json_data:
        json_data = json.loads(json_data)  # JSON文字列をPython辞書に変換

    start_frame = (json_data["start"] - json_data["readTime"]["start"]) * json_data[
        "hedValue"
    ]["sampling_rate"]
    end_frame = (json_data["end"] - json_data["readTime"]["start"]) * json_data[
        "hedValue"
    ]["sampling_rate"]
    if start_frame < 0:
        start_frame = 0
    if end_frame < 0:
        end_frame = 1
    if (
        end_frame
        > json_data["readTime"]["end"] * json_data["hedValue"]["sampling_rate"]
    ):
        end_frame = len(data[0])

    return data[:, int(start_frame) : int(end_frame)], json_data


def showAllService() -> str:
    data, json_data = decode_request()
    form_value = FormValue(json_data=json_data)

    image = showAll(data, form_value)

    return image


def showSingleService() -> str:
    data, json_data = decode_request()
    x, y = data[0], data[1]
    form_value = FormValue(json_data=json_data)

    image = showSingle(x, y, form_value)

    return image


def showDetectionService() -> str:
    data, json_data = decode_request()
    form_value = FormValue(json_data=json_data)
    chs = json_data["chs"]

    image = showDetection(data, form_value, chs)

    return image


def rasterPlotService() -> str:
    data, json_data = decode_request()
    form_value = FormValue(json_data=json_data)
    chs = json_data["chs"]
    peak_form_value = PeakFormValue(json_data=json_data)

    isPos, isNeg = peak_form_value.isPositive, peak_form_value.isNegative

    if not isPos and not isNeg:
        return ""

    if not isPos and isNeg:
        peak_index = detect_peak_neg(
            data, peak_form_value.distance, peak_form_value.threshold
        )
        image = raster_plot(data, form_value, chs, peak_index)
    elif isPos and not isNeg:
        peak_index = detect_peak_pos(
            data, peak_form_value.distance, peak_form_value.threshold
        )
        image = raster_plot(data, form_value, chs, peak_index)
    else:
        pos_peak = detect_peak_pos(
            data, peak_form_value.distance, peak_form_value.threshold
        )
        neg_peak = detect_peak_neg(
            data, peak_form_value.distance, peak_form_value.threshold
        )
        image = raster_plot(data, form_value, chs, pos_peak, neg_peak)

    return image
