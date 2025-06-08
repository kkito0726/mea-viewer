import io
import json

import matplotlib

matplotlib.use("Agg")  # GUIバックエンドを使用しないように設定

import numpy as np
from flask import request
from pyMEA import FigMEA, detect_peak_all, detect_peak_neg, detect_peak_pos
from pyMEA.core.Electrode import Electrode
from pyMEA.read.model.HedPath import HedPath
from pyMEA.read.model.MEA import MEA

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


# 受け取った電位データからnanを取り除く
# FEで読み込むときに読み込み終了時間をデータ量より長く設定すると足りない分nanで補われる
def clean_data(data):
    if not np.isnan(data).any():
        return data

    volt = np.array([row[~np.isnan(row)] for row in data[1:]])
    t = data[0][: len(volt[0])]
    t = t.reshape(1, len(t))
    return np.append(t, volt, axis=0)


# 受け取った電位データ以外はダミーデータで保管してpyMEAで使用できるようにする
def complete_data(data, form_value: FormValue):
    if len(data) == 65:
        return data

    length = len(data[0])
    result = np.ones((65, length), dtype=data[0].dtype)
    result[0] = data[0]

    index = 1
    for ch in range(1, 65):
        if ch in set(form_value.chs):
            result[ch] = data[index]
            index += 1
    return result


def showAllService() -> tuple[io.BytesIO, str]:
    data, json_data = decode_request()
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
    ).buf

    return image_buf, form_value.filename


def showSingleService() -> tuple[list[int], list[io.BytesIO], str]:
    data, json_data = decode_request()
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
        ).buf
        for ch in range(1, len(data))
    ]

    return form_value.chs, image_bufs, form_value.filename


def showDetectionService() -> tuple[io.BytesIO, str]:
    data, json_data = decode_request()
    form_value = FormValue(json_data=json_data)
    data = complete_data(data, form_value)
    fm = create_figMEA(data, form_value)

    image_buf = fm.showDetection(
        form_value.chs,
        start=form_value.start,
        end=form_value.end,
        figsize=(form_value.x_ratio, form_value.y_ratio),
        dpi=form_value.dpi,
        isBuf=True,
    ).buf

    return image_buf, form_value.filename


def rasterPlotService() -> tuple[io.BytesIO, str]:
    data, json_data = decode_request()
    form_value = FormValue(json_data=json_data)
    peak_form_value = PeakFormValue(json_data=json_data)

    data = complete_data(data, form_value)
    fm = create_figMEA(data, form_value)
    peak_index = get_peak_indexes(peak_form_value, fm.data)

    image_buf = fm.raster_plot(
        peak_index,
        form_value.chs,
        figsize=(form_value.x_ratio, form_value.y_ratio),
        start=form_value.start,
        end=form_value.end,
        dpi=form_value.dpi,
        isBuf=True,
    ).buf

    return image_buf, form_value.filename


def draw_2d_service() -> tuple[list[io.BytesIO], str]:
    data, json_data = decode_request()
    form_value = FormValue(json_data)
    peak_form_value = PeakFormValue(json_data=json_data)

    fm = create_figMEA(data, form_value)
    peak_index = detect_peak_neg(
        fm.data, peak_form_value.distance, peak_form_value.threshold
    )
    image_buf_list = fm.draw_2d(peak_index, dpi=form_value.dpi, isBuf=True).buf_list

    return image_buf_list, form_value.filename


def draw_3d_service() -> tuple[list[io.BytesIO], str]:
    data, json_data = decode_request()
    form_value = FormValue(json_data)
    peak_form_value = PeakFormValue(json_data)

    fm = create_figMEA(data, form_value)
    peak_index = detect_peak_neg(
        fm.data, peak_form_value.distance, peak_form_value.threshold
    )
    image_bufs = fm.draw_3d(peak_index, dpi=form_value.dpi, isBuf=True).buf_list

    return image_bufs, form_value.filename


def plot_peaks_service():
    data, json_data = decode_request()
    peak_form_value = PeakFormValue(json_data=json_data)
    form_value = FormValue(json_data=json_data)

    data = complete_data(data, form_value)
    fm = create_figMEA(data, form_value)
    peak_index = get_peak_indexes(peak_form_value, fm.data)

    image_bufs = [
        fm.plotPeaks(
            ch,
            peak_index,
            start=form_value.start,
            end=form_value.end,
            volt_min=form_value.volt_min,
            volt_max=form_value.volt_max,
            figsize=(form_value.x_ratio, form_value.y_ratio),
            dpi=form_value.dpi,
            isBuf=True,
        ).buf
        for ch in form_value.chs
    ]

    return form_value.chs, image_bufs, form_value.filename


def get_peak_indexes(peak_form_value: PeakFormValue, data: MEA):
    if not peak_form_value.isNegative and not peak_form_value.isPositive:
        raise ValueError("ピーク抽出条件が指定されていません")
    elif peak_form_value.isNegative and peak_form_value.isPositive:
        return detect_peak_all(
            data,
            (peak_form_value.threshold, peak_form_value.threshold),
            peak_form_value.distance,
        )
    elif peak_form_value.isNegative:
        return detect_peak_neg(
            data, peak_form_value.distance, peak_form_value.threshold
        )
    else:
        return detect_peak_pos(
            data, peak_form_value.distance, peak_form_value.threshold
        )


def create_figMEA(data, form_value: FormValue):
    data = MEA(
        HedPath("tmp.hed"),
        form_value.readTime.start,
        data[0][-1],
        form_value.hedValue.sampling_rate,
        form_value.hedValue.gain,
        data,
    )
    return FigMEA(data, Electrode(form_value.electrode_distance))
