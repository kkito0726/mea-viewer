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

    @classmethod
    def from_value(cls, value: str) -> "FigType":
        for member in cls:
            if member.value == value:
                return member
        raise ValueError(f"{value!r} is not a valid {cls.__name__}")
