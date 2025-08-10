from dataclasses import dataclass

from pyMEA import FigMEA, VideoMEA, detect_peak_neg

from enums.FigType import FigType
from lib.bufferUtil import bytesio_list_to_gif
from model.FigImageData import FigImageData
from model.form_value import FormValue
from model.peak_form_value import PeakFormValue
from model.video_form_value import VideoFormValue
from service.fig_service import get_peak_indexes


@dataclass(frozen=True)
class VideoService:
    fm: FigMEA
    form_value: FormValue
    peak_form_value: PeakFormValue
    video_form_value: VideoFormValue

    @property
    def frames(self):
        return int(
            (
                self.form_value.end
                - self.form_value.start
                - self.video_form_value.window_time
            )
            / self.video_form_value.duration
            + 1
        )

    def showAll(self):
        fig_images = [
            self.fm.showAll(
                self.form_value.start + i * self.video_form_value.duration,
                self.form_value.start
                + self.video_form_value.window_time
                + i * self.video_form_value.duration,
                self.form_value.volt_min,
                self.form_value.volt_max,
                (self.form_value.x_ratio, self.form_value.y_ratio),
                dpi=self.form_value.dpi,
                isBuf=True,
            )
            for i in range(self.frames)
        ]
        video = VideoMEA(fig_images)
        gif_buf = bytesio_list_to_gif(video.buf_list, self.video_form_value.duration)

        return [
            FigImageData(None, FigType.SHOW_ALL_GIF, gif_buf, self.form_value.filename)
        ]

    def showSingle(self):
        result: list[FigImageData] = []
        for ch in self.form_value.chs:
            fig_images = [
                self.fm.showSingle(
                    ch,
                    self.form_value.start + i * self.video_form_value.duration,
                    self.form_value.start
                    + self.video_form_value.window_time
                    + i * self.video_form_value.duration,
                    self.form_value.volt_min,
                    self.form_value.volt_max,
                    (self.form_value.x_ratio, self.form_value.y_ratio),
                    dpi=self.form_value.dpi,
                    isBuf=True,
                )
                for i in range(self.frames)
            ]
            video = VideoMEA(fig_images)
            gif_buf = bytesio_list_to_gif(
                video.buf_list, self.video_form_value.duration
            )
            result.append(
                FigImageData(
                    ch, FigType.SHOW_SINGLE_GIF, gif_buf, self.form_value.filename
                )
            )

        return result

    def showDetection(self):
        fig_images = [
            self.fm.showDetection(
                self.form_value.chs,
                self.form_value.start + i * self.video_form_value.duration,
                self.form_value.start
                + self.video_form_value.window_time
                + i * self.video_form_value.duration,
                figsize=(self.form_value.x_ratio, self.form_value.y_ratio),
                dpi=self.form_value.dpi,
                isBuf=True,
            )
            for i in range(self.frames)
        ]
        video = VideoMEA(fig_images)
        gif_buf = bytesio_list_to_gif(video.buf_list, self.video_form_value.duration)

        return [
            FigImageData(
                None, FigType.SHOW_DETECTION_GIF, gif_buf, self.form_value.filename
            )
        ]

    def rasterPlot(self):
        peak_index = get_peak_indexes(self.peak_form_value, self.fm.data)
        fig_images = [
            self.fm.raster_plot(
                peak_index,
                self.form_value.chs,
                figsize=(self.form_value.x_ratio, self.form_value.y_ratio),
                start=self.form_value.start + i * self.video_form_value.duration,
                end=self.form_value.start
                + self.video_form_value.window_time
                + i * self.video_form_value.duration,
                dpi=self.form_value.dpi,
                isBuf=True,
            )
            for i in range(self.frames)
        ]
        video = VideoMEA(fig_images)
        gif_buf = bytesio_list_to_gif(video.buf_list, self.video_form_value.duration)

        return [
            FigImageData(
                None, FigType.RASTER_PLOT_GIF, gif_buf, self.form_value.filename
            )
        ]

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
