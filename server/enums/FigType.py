from enum import Enum


class FigType(Enum):
    SHOW_ALL = "showAll"
    SHOW_SINGLE = "showSingle"
    SHOW_DETECTION = "showDetection"
    RASTER_PLOT = "rasterPlot"
    DRAW_2D = "draw2d"
    DRAW_3D = "draw3d"
    PLOT_PEAKS = "plotPeaks"
