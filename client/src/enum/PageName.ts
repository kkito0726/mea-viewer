export const enum PageName {
  SHOW_ALL = "showAll",
  SHOW_SINGLE = "showSingle",
  SHOW_DETECTION = "showDetection",
  RASTER_PLOT = "rasterPlot",
  DRAW_2D = "draw2d",
  DRAW_3D = "draw3d",
  DRAW_LINE = "drawLine",
  PLOT_PEAKS = "plotPeaks",

  SHOW_ALL_GIF = "showAllGif",
  SHOW_SINGLE_GIF = "showSingleGif",
  SHOW_DETECTION_GIF = "showDetectionGif",
  RASTER_PLOT_GIF = "rasterPlotGif",
  DRAW_2D_GIF = "draw2dGif",
  DRAW_3D_GIF = "draw3dGif",
  DRAW_LINE_GIF = "drawLineGif",
}

export const chPadPages: string[] = [
  PageName.SHOW_SINGLE,
  PageName.SHOW_DETECTION,
  PageName.RASTER_PLOT,
  PageName.DRAW_LINE,
  PageName.PLOT_PEAKS,
  PageName.SHOW_SINGLE_GIF,
  PageName.SHOW_DETECTION_GIF,
  PageName.RASTER_PLOT_GIF,
  PageName.DRAW_LINE_GIF,
];

export const gifPageList = [
  PageName.SHOW_ALL_GIF,
  PageName.SHOW_SINGLE_GIF,
  PageName.SHOW_DETECTION_GIF,
  PageName.RASTER_PLOT_GIF,
  PageName.DRAW_2D_GIF,
  PageName.DRAW_3D_GIF,
  PageName.DRAW_LINE_GIF,
];

export const onlyPythonList = [
  PageName.DRAW_2D,
  PageName.DRAW_3D,
  PageName.DRAW_LINE,
  ...gifPageList,
];
