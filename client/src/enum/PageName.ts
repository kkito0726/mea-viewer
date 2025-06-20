export const enum PageName {
  SHOW_ALL = "showAll",
  SHOW_SINGLE = "showSingle",
  SHOW_DETECTION = "showDetection",
  RASTER_PLOT = "rasterPlot",
  DRAW_2D = "draw2d",
  DRAW_3D = "draw3d",
  DRAWLine = "drawLine",
  PlotPeaks = "plotPeaks",
}

export const chPadPages: string[] = [
  PageName.SHOW_SINGLE,
  PageName.SHOW_DETECTION,
  PageName.RASTER_PLOT,
  PageName.DRAWLine,
  PageName.PlotPeaks,
];

export const onlyPythonList = [
  PageName.DRAW_2D,
  PageName.DRAW_3D,
  PageName.DRAWLine,
];
