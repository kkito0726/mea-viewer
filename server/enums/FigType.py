from enum import Enum


class FigType(Enum):
    SHOW_ALL = "showAll"
    SHOW_SINGLE = "showSingle"
    SHOW_DETECTION = "showDetection"
    RASTER_PLOT = "rasterPlot"
    DRAW_2D = "draw2d"
    DRAW_3D = "draw3d"
    DRAW_LINE = "drawLine"
    PLOT_PEAKS = "plotPeaks"

    SHOW_ALL_GIF = "showAllGif"
    SHOW_SINGLE_GIF = "showSingleGif"
    SHOW_DETECTION_GIF = "showDetectionGif"
    RASTER_PLOT_GIF = "rasterPlotGif"
    DRAW_2D_GIF = "draw2dGif"
    DRAW_3D_GIF = "draw3dGif"
    DRAW_LINE_GIF = "drawLineGif"

    @property
    def image_fig_type_list():
        return [
            FigType.SHOW_ALL,
            FigType.SHOW_SINGLE,
            FigType.SHOW_DETECTION,
            FigType.RASTER_PLOT,
            FigType.DRAW_2D,
            FigType.DRAW_3D,
            FigType.DRAW_LINE,
            FigType.PLOT_PEAKS,
        ]

    @classmethod
    def from_value(cls, value: str) -> "FigType":
        for member in cls:
            if member.value == value:
                return member
        raise ValueError(f"{value!r} is not a valid {cls.__name__}")
