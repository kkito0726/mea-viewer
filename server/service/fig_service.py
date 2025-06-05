import io
import json

import numpy as np
import pyMEA
from flask import request
from pyMEA import FigMEA
from pyMEA.core.Electrode import Electrode
from pyMEA.read.model.HedPath import HedPath
from pyMEA.read.model.MEA import MEA

from lib.peak_detection import detect_peak_neg, detect_peak_pos
from lib.plot import plotPeaks, raster_plot, showDetection
from model.form_value import FormValue
from model.peak_form_value import PeakFormValue


def decode_request():
    # POSTされたファイルデータを取得
    files = request.files.values()
    data = clean_data(
        np.array([np.frombuffer(file.read(), dtype=np.float32) for file in files])
    )

    json_data = request.form.get("jsonData")
    if json_data:
        json_data = json.loads(json_data)  # JSON文字列をPython辞書に変換

    return data, json_data


def clean_data(data):
    volt = np.array([row[~np.isnan(row)] for row in data[1:]])
    t = data[0][: len(volt[0])]
    t = t.reshape(1, len(t))
    return np.append(t, volt, axis=0)


def showAllService() -> tuple[io.BytesIO, str]:
    data, json_data = decode_request()
    filename = json_data["filename"]
    form_value = FormValue(json_data=json_data)
    fm = create_figMEA(data, form_value)

    image_buf = fm.showAll(
        form_value.start,
        form_value.end,
        form_value.volt_min,
        form_value.volt_max,
        (form_value.x_ratio, form_value.y_ratio),
        form_value.dpi,
        isBuf=True,
    )

    return image_buf, filename


def showSingleService() -> tuple[list[int], io.BytesIO, str]:
    data, json_data = decode_request()
    filename = json_data["filename"]
    form_value = FormValue(json_data=json_data)

    fm = create_figMEA(data, form_value)
    image_bufs = [
        fm.showSingle(
            ch,
            form_value.start,
            form_value.end,
            form_value.volt_min,
            form_value.volt_max,
            figsize=(form_value.x_ratio, form_value.y_ratio),
            dpi=form_value.dpi,
            isBuf=True,
        )
        for ch in range(1, len(data))
    ]

    return form_value.chs, image_bufs, filename


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
    form_value = FormValue(json_data)
    peak_form_value = PeakFormValue(json_data=json_data)
    filename = json_data["filename"]

    fm = create_figMEA(data, form_value)
    peak_index = pyMEA.detect_peak_neg(
        fm.data, peak_form_value.distance, peak_form_value.threshold
    )
    image_buf_list = fm.draw_2d(peak_index, dpi=form_value.dpi, isBuf=True)

    return image_buf_list, filename


def draw_3d_service() -> tuple[list[io.BytesIO], str]:
    data, json_data = decode_request()
    form_value = FormValue(json_data)
    filename = json_data["filename"]
    peak_form_value = PeakFormValue(json_data)

    fm = create_figMEA(data, form_value)
    peak_index = pyMEA.detect_peak_neg(
        fm.data, peak_form_value.distance, peak_form_value.threshold
    )
    image_bufs = fm.draw_3d(peak_index, dpi=form_value.dpi, isBuf=True)

    return image_bufs, filename


def plot_peaks_service():
    data, json_data = decode_request()
    filename = json_data["filename"]
    peak_form_value = PeakFormValue(json_data=json_data)
    form_value = FormValue(json_data=json_data)

    neg_peak_index, pos_peak_index = [], []

    if peak_form_value.isNegative:
        neg_peak_index = detect_peak_neg(
            data, peak_form_value.distance, peak_form_value.threshold
        )

    if peak_form_value.isPositive:
        pos_peak_index = detect_peak_pos(
            data, peak_form_value.distance, peak_form_value.threshold
        )

    image_bufs = [
        plotPeaks(data, form_value, i, neg_peak_index, pos_peak_index)
        for i in range(1, len(data))
    ]

    return json_data["chs"], image_bufs, filename


def create_figMEA(data, form_value: FormValue):
    data = MEA(
        HedPath("tmp.hed"),
        form_value.readTime.start,
        data[0][-1],
        form_value.hedValue.sampling_rate,
        form_value.hedValue.gain,
        data,
    )
    return FigMEA(data, Electrode(450))
