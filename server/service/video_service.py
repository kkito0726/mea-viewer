from dataclasses import dataclass

from pyMEA import FigMEA, detect_peak_neg

from enums.FigType import FigType
from lib.bufferUtil import bytesio_list_to_gif
from model.FigImageData import FigImageData
from model.form_value import FormValue
from model.peak_form_value import PeakFormValue


@dataclass(frozen=True)
class VideoService:
    fm: FigMEA
    form_value: FormValue
    peak_form_value: PeakFormValue

    def draw_2d(self):
        peak_index = detect_peak_neg(
            self.fm.data, self.peak_form_value.distance, self.peak_form_value.threshold
        )
        image_bufs = self.fm.draw_2d(
            peak_index=peak_index,
            base_ch=self.peak_form_value.base_ch,
            dpi=self.form_value.dpi,
            isBuf=True,
        ).buf_list

        gif_buf = bytesio_list_to_gif(image_bufs)

        return [
            FigImageData(None, FigType.DRAW_2D_GIF, gif_buf, self.form_value.filename)
        ]

    def draw_3d(self):
        peak_index = detect_peak_neg(
            self.fm.data, self.peak_form_value.distance, self.peak_form_value.threshold
        )
        image_bufs = self.fm.draw_3d(
            peak_index, dpi=self.form_value.dpi, isBuf=True
        ).buf_list

        gif_buf = bytesio_list_to_gif(image_bufs)

        return [
            FigImageData(None, FigType.DRAW_3D_GIF, gif_buf, self.form_value.filename)
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
            dpi=self.form_value.dpi,
            isBuf=True,
        ).buf_list

        gif_buf = bytesio_list_to_gif(image_bufs)

        return [
            FigImageData(None, FigType.DRAW_LINE_GIF, gif_buf, self.form_value.filename)
        ]
