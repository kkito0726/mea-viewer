from dataclasses import dataclass

from enums.FigType import FigType
from model.FigImageData import FigImageData
from service.fig_service import FigService


@dataclass(frozen=True)
class FigDispatchService:
    fig_service: FigService
    fig_type: FigType

    def create_fig(self) -> list[FigImageData]:
        if self.fig_type == FigType.SHOW_ALL:
            return self.fig_service.showAll()
        elif self.fig_type == FigType.SHOW_SINGLE:
            return self.fig_service.showSingle()
        elif self.fig_type == FigType.SHOW_DETECTION:
            return self.fig_service.showDetection()
        elif self.fig_type == FigType.RASTER_PLOT:
            return self.fig_service.rasterPlot()
        elif self.fig_type == FigType.DRAW_2D:
            return self.fig_service.draw_2d()
        elif self.fig_type == FigType.DRAW_3D:
            return self.fig_service.draw_3d()
        elif self.fig_type == FigType.DRAW_LINE:
            return self.fig_service.draw_line()
        else:
            return self.fig_service.plot_peaks_service()
