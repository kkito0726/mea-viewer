from dataclasses import dataclass

from enums.FigType import FigType
from model.FigImageData import FigImageData
from service.FigDispatchService import FigDispatchService
from service.video_service import VideoService


@dataclass(frozen=True)
class FigVideoDispatchService(FigDispatchService):
    video_service: VideoService
    fig_type: FigType

    def create_fig(self) -> list[FigImageData]:
        if self.fig_type == FigType.SHOW_SINGLE_GIF:
            return self.video_service.showSingle()
        if self.fig_type == FigType.DRAW_2D_GIF:
            return self.video_service.draw_2d()
        if self.fig_type == FigType.DRAW_3D_GIF:
            return self.video_service.draw_3d()
        if self.fig_type == FigType.DRAW_LINE_GIF:
            return self.video_service.draw_line()
