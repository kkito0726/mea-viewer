from dataclasses import dataclass

import matplotlib
from enums.FigType import FigType
from model.FigImageData import FigImageData

matplotlib.use("Agg")  # GUIバックエンドを使用しないように設定

from model.form_value import FormValue
from model.peak_form_value import PeakFormValue
from pyMEA import FigMEA, detect_peak_all, detect_peak_neg, detect_peak_pos
from pyMEA.read.model.MEA import MEA


@dataclass(frozen=True)
class FigService:
    fm: FigMEA
    form_value: FormValue
    peak_form_value: PeakFormValue

    def showAll(self) -> list[FigImageData]:
        image_buf = self.fm.showAll(
            self.form_value.start,
            self.form_value.end,
            self.form_value.volt_min,
            self.form_value.volt_max,
            (self.form_value.x_ratio, self.form_value.y_ratio),
            self.form_value.dpi,
            isBuf=True,
        ).buf
        return [
            FigImageData(None, FigType.SHOW_ALL, image_buf, self.form_value.filename)
        ]

    def showSingle(self) -> list[FigImageData]:
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
        return [
            FigImageData(ch, FigType.SHOW_SINGLE, image_buf, self.form_value.filename)
            for ch, image_buf in zip(self.form_value.chs, image_bufs)
        ]

    def showDetection(self) -> list[FigImageData]:
        image_buf = self.fm.showDetection(
            self.form_value.chs,
            start=self.form_value.start,
            end=self.form_value.end,
            figsize=(self.form_value.x_ratio, self.form_value.y_ratio),
            dpi=self.form_value.dpi,
            isBuf=True,
        ).buf

        return [
            FigImageData(
                None, FigType.SHOW_DETECTION, image_buf, self.form_value.filename
            )
        ]

    def rasterPlot(self) -> list[FigImageData]:
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

        return [
            FigImageData(None, FigType.RASTER_PLOT, image_buf, self.form_value.filename)
        ]

    def draw_2d(self) -> list[FigImageData]:
        peak_index = detect_peak_neg(
            self.fm.data, self.peak_form_value.distance, self.peak_form_value.threshold
        )
        image_bufs = self.fm.draw_2d(
            peak_index=peak_index,
            base_ch=self.peak_form_value.base_ch,
            dpi=self.form_value.dpi,
            isBuf=True,
        ).buf_list

        return [
            FigImageData(None, FigType.DRAW_2D, image_buf, self.form_value.filename)
            for image_buf in image_bufs
        ]

    def draw_3d(self) -> list[FigImageData]:
        peak_index = detect_peak_neg(
            self.fm.data, self.peak_form_value.distance, self.peak_form_value.threshold
        )
        image_bufs = self.fm.draw_3d(
            peak_index, dpi=self.form_value.dpi, isBuf=True
        ).buf_list

        return [
            FigImageData(None, FigType.DRAW_3D, image_buf, self.form_value.filename)
            for image_buf in image_bufs
        ]

    def draw_line(self):
        peak_index = detect_peak_neg(
            self.fm.data, self.peak_form_value.distance, self.peak_form_value.threshold
        )
        image_bufs = self.fm.draw_line_conduction(
            peak_index=peak_index,
            amc_chs=self.form_value.chs,
            base_ch=self.peak_form_value.base_ch,
            isLoop=self.peak_form_value.isLoop,
            isBuf=True,
        ).buf_list

        return [
            FigImageData(None, FigType.DRAW_LINE, image_buf, self.form_value.filename)
            for image_buf in image_bufs
        ]

    def plot_peaks_service(self) -> list[FigImageData]:
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

        return [
            FigImageData(ch, FigType.PLOT_PEAKS, image_buf, self.form_value.filename)
            for ch, image_buf in zip(self.form_value.chs, image_bufs)
        ]


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
