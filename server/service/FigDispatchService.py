from dataclasses import dataclass

from flask import jsonify

from enums.FigType import FigType
from service.draw2d_service import Draw2dService
from service.draw3d_service import Draw3dService
from service.fig_service import FigService
from service.mino_service import MinioService
from service.plotPeaks_service import PlotPeaksService
from service.rasterPlot_service import RasterPlotService
from service.showAll_service import ShowAllService
from service.showDetection_service import ShowDetectionService
from service.showSingle_service import ShowSingleService


@dataclass(frozen=True)
class FigDispatchService:
    fig_service: FigService
    fig_type: FigType

    def create_fig(self):
        if self.fig_type == FigType.SHOW_ALL:
            image_buf, filename = self.fig_service.showAll()
            img_url = MinioService.save(FigType.SHOW_ALL.value, image_buf, filename)
            return jsonify(ShowAllService.insert(img_url, filename)), 200
        elif self.fig_type == FigType.SHOW_SINGLE:
            chs, image_bufs, filename = self.fig_service.showSingle()
            img_urls = MinioService.saves(
                FigType.SHOW_SINGLE.value, image_bufs, filename
            )
            img_responses = ShowSingleService.inserts(chs, img_urls, filename)
            return jsonify(img_responses), 200
        elif self.fig_type == FigType.SHOW_DETECTION:
            image_buf, filename = self.fig_service.showDetection()
            img_url = MinioService.save(
                FigType.SHOW_DETECTION.value, image_buf, filename
            )
            return jsonify(ShowDetectionService.insert(img_url, filename)), 200
        elif self.fig_type == FigType.RASTER_PLOT:
            image_buf, filename = self.fig_service.rasterPlot()
            img_url = MinioService.save(FigType.RASTER_PLOT.value, image_buf, filename)
            return jsonify(RasterPlotService.insert(img_url, filename)), 200
        elif self.fig_type == FigType.DRAW_2D:
            image_bufs, filename = self.fig_service.draw_2d()
            image_urls = MinioService.saves(FigType.DRAW_2D.value, image_bufs, filename)
            image_responses = Draw2dService.inserts(image_urls, filename)
            return jsonify(image_responses), 200
        elif self.fig_type == FigType.DRAW_3D:
            image_bufs, filename = self.fig_service.draw_3d()
            image_urls = MinioService.saves(FigType.DRAW_3D.value, image_bufs, filename)
            image_responses = Draw3dService.inserts(image_urls, filename)
            return jsonify(image_responses), 200
        else:
            chs, image_bufs, file_name = self.fig_service.plot_peaks_service()
            image_urls = MinioService.saves(
                FigType.PLOT_PEAKS.value, image_bufs, file_name
            )
            image_response = PlotPeaksService.inserts(chs, image_urls, file_name)
            return jsonify(image_response), 200
