package com.mea_viewer_backend.figure_management.enums;

import static com.jooq.generated.Tables.DRAW2D_IMAGES;
import static com.jooq.generated.Tables.DRAW3D_IMAGES;
import static com.jooq.generated.Tables.PLOT_PEAKS_IMAGES;
import static com.jooq.generated.Tables.RASTER_PLOT_IMAGES;
import static com.jooq.generated.Tables.SHOW_ALL_IMAGES;
import static com.jooq.generated.Tables.SHOW_DETECTION_IMAGES;
import static com.jooq.generated.Tables.SHOW_SINGLE_IMAGES;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.jooq.impl.TableImpl;

@Getter
@AllArgsConstructor
public enum FigType {

  SHOW_ALL("showAll", "show_all_images", SHOW_ALL_IMAGES),
  SHOW_SINGLE("showSingle", "show_single_images", SHOW_SINGLE_IMAGES),
  SHOW_DETECTION("showDetection", "show_detection_images", SHOW_DETECTION_IMAGES),
  RASTER_PLOT("rasterPlot", "raster_plot_images", RASTER_PLOT_IMAGES),
  DRAW_2D("draw2d", "draw2d_images", DRAW2D_IMAGES),
  DRAW_3D("draw3d", "draw3d_images", DRAW3D_IMAGES),
  PLOT_PEAKS("plotPeaks", "plot_peaks_images", PLOT_PEAKS_IMAGES);

  private final String code;
  private final String tableName;
  private final TableImpl<?> table;
}
