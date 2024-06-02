from flask import request
from model.form_value import FormValue
from model.peak_form_value import PeakFormValue
from lib.plot import showAll, showSingle, showDetection, raster_plot
from lib.peak_detection import detect_peak_neg, detect_peak_pos
from lib.colormap import remove_fit_data, draw_2d, draw_3d
import io
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


def showAllService() -> tuple[io.BytesIO, str]:
    data, json_data = decode_request()
    filename = json_data["filename"]
    form_value = FormValue(json_data=json_data)

    image_buf = showAll(data, form_value)

    return image_buf, filename


def showSingleService() -> tuple[io.BytesIO, int, str]:
    data, json_data = decode_request()
    filename = json_data["filename"]
    form_value = FormValue(json_data=json_data)

    image_bufs = [showSingle(data[0], data[i], form_value) for i in range(1, len(data))]

    return image_bufs, json_data["chs"], filename


def showDetectionService() -> tuple[io.BytesIO, str]:
    data, json_data = decode_request()
    form_value = FormValue(json_data=json_data)
    chs = json_data["chs"]
    filename = json_data["filename"]

    image_buf = showDetection(data, form_value, chs)

    return image_buf, filename


def rasterPlotService() -> tuple[io.BytesIO, str]:
    data, json_data = decode_request()
    form_value = FormValue(json_data=json_data)
    chs = json_data["chs"]
    filename = json_data["filename"]
    peak_form_value = PeakFormValue(json_data=json_data)

    isPos, isNeg = peak_form_value.isPositive, peak_form_value.isNegative

    if not isPos and not isNeg:
        return ""

    if not isPos and isNeg:
        peak_index = detect_peak_neg(
            data, peak_form_value.distance, peak_form_value.threshold
        )
        image_buf = raster_plot(data, form_value, chs, peak_index)
    elif isPos and not isNeg:
        peak_index = detect_peak_pos(
            data, peak_form_value.distance, peak_form_value.threshold
        )
        image_buf = raster_plot(data, form_value, chs, peak_index)
    else:
        pos_peak = detect_peak_pos(
            data, peak_form_value.distance, peak_form_value.threshold
        )
        neg_peak = detect_peak_neg(
            data, peak_form_value.distance, peak_form_value.threshold
        )
        image_buf = raster_plot(data, form_value, chs, pos_peak, neg_peak)

    return image_buf, filename


def draw_2d_service() -> tuple[list[io.BytesIO], str]:
    data, json_data = decode_request()
    peak_form_value = PeakFormValue(json_data=json_data)
    filename = json_data["filename"]
    peak_index = detect_peak_neg(
        data, peak_form_value.distance, peak_form_value.threshold
    )

    popts, _ = remove_fit_data(data, peak_index, ele_dis=450)
    image_bufs = [draw_2d(popt, 450, 100, False, True) for popt in popts]

    return image_bufs, filename


def draw_3d_service() -> tuple[list[io.BytesIO], str]:
    data, json_data = decode_request()
    filename = json_data["filename"]
    peak_form_value = PeakFormValue(json_data=json_data)
    peak_index = detect_peak_neg(
        data, peak_form_value.distance, peak_form_value.threshold
    )

    popts, _ = remove_fit_data(data, peak_index, ele_dis=450)
    image_bufs = [draw_3d(popt, 450, 100) for popt in popts]

    return image_bufs, filename
