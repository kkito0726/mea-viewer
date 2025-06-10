import io
from dataclasses import dataclass

import matplotlib

matplotlib.use("Agg")  # GUIバックエンドを使用しないように設定

import numpy as np
from flask import request
from pyMEA import FigMEA, detect_peak_all, detect_peak_neg, detect_peak_pos
from pyMEA.read.model.MEA import MEA

from model.form_value import FormValue
from model.peak_form_value import PeakFormValue


@dataclass(frozen=True)
class FigService:
    fm: FigMEA
    form_value: FormValue
    peak_form_value: PeakFormValue

    def showAll(self) -> tuple[io.BytesIO, str]:
        image_buf = self.fm.showAll(
            self.form_value.start,
            self.form_value.end,
            self.form_value.volt_min,
            self.form_value.volt_max,
            (self.form_value.x_ratio, self.form_value.y_ratio),
            self.form_value.dpi,
            isBuf=True,
        ).buf

        return image_buf, self.form_value.filename

    def showSingle(self) -> tuple[list[int], list[io.BytesIO], str]:
        image_bufs = [
            self.fm.showSingle(
                ch,
                self.form_value.start,
                self.form_value.end,
                self.form_value.volt_min,
                self.form_value.volt_max,
                figsize=(self.form_value.x_ratio, self.form_value.y_ratio),
                dpi=self.form_value.dpi,
                isBuf=True,
            ).buf
            for ch in self.form_value.chs
        ]

        return self.form_value.chs, image_bufs, self.form_value.filename

    def showDetection(self) -> tuple[io.BytesIO, str]:
        image_buf = self.fm.showDetection(
            self.form_value.chs,
            start=self.form_value.start,
            end=self.form_value.end,
            figsize=(self.form_value.x_ratio, self.form_value.y_ratio),
            dpi=self.form_value.dpi,
            isBuf=True,
        ).buf

        return image_buf, self.form_value.filename

    def rasterPlot(self) -> tuple[io.BytesIO, str]:
        peak_index = get_peak_indexes(self.peak_form_value, self.fm.data)

        image_buf = self.fm.raster_plot(
            peak_index,
            self.form_value.chs,
            figsize=(self.form_value.x_ratio, self.form_value.y_ratio),
            start=self.form_value.start,
            end=self.form_value.end,
            dpi=self.form_value.dpi,
            isBuf=True,
        ).buf

        return image_buf, self.form_value.filename

    def draw_2d(self) -> tuple[list[io.BytesIO], str]:
        peak_index = detect_peak_neg(
            self.fm.data, self.peak_form_value.distance, self.peak_form_value.threshold
        )
        image_buf_list = self.fm.draw_2d(
            peak_index, dpi=self.form_value.dpi, isBuf=True
        ).buf_list

        return image_buf_list, self.form_value.filename

    def draw_3d(self) -> tuple[list[io.BytesIO], str]:
        peak_index = detect_peak_neg(
            self.fm.data, self.peak_form_value.distance, self.peak_form_value.threshold
        )
        image_bufs = self.fm.draw_3d(
            peak_index, dpi=self.form_value.dpi, isBuf=True
        ).buf_list

        return image_bufs, self.form_value.filename

    def plot_peaks_service(self):
        peak_index = get_peak_indexes(self.peak_form_value, self.fm.data)

        image_bufs = [
            self.fm.plotPeaks(
                ch,
                peak_index,
                start=self.form_value.start,
                end=self.form_value.end,
                volt_min=self.form_value.volt_min,
                volt_max=self.form_value.volt_max,
                figsize=(self.form_value.x_ratio, self.form_value.y_ratio),
                dpi=self.form_value.dpi,
                isBuf=True,
            ).buf
            for ch in self.form_value.chs
        ]

        return self.form_value.chs, image_bufs, self.form_value.filename


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
