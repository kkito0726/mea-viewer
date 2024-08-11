package com.mea_viewer_backend.figure_management.factory;

import com.mea_viewer_backend.figure_management.enums.FigType;
import com.mea_viewer_backend.figure_management.repository.image.impl.Draw2dRepository;
import com.mea_viewer_backend.figure_management.repository.image.impl.Draw3dRepository;
import com.mea_viewer_backend.figure_management.repository.image.ImageRepository;
import com.mea_viewer_backend.figure_management.repository.image.impl.RasterPlotRepository;
import com.mea_viewer_backend.figure_management.repository.image.impl.ShowAllRepository;
import com.mea_viewer_backend.figure_management.repository.image.impl.ShowDetectionRepository;
import com.mea_viewer_backend.figure_management.repository.image.impl.ShowSingleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ImageRepositoryFactory {
  private final ShowAllRepository showAllRepository;
  private final ShowSingleRepository showSingleRepository;
  private final ShowDetectionRepository showDetectionRepository;
  private final RasterPlotRepository rasterPlotRepository;
  private final Draw2dRepository draw2dRepository;
  private final Draw3dRepository draw3dRepository;

  public ImageRepository getRepository(FigType figType) {
    return switch (figType) {
      case SHOW_ALL -> showAllRepository;
      case SHOW_SINGLE -> showSingleRepository;
      case SHOW_DETECTION -> showDetectionRepository;
      case RASTER_PLOT -> rasterPlotRepository;
      case DRAW_2D -> draw2dRepository;
      case DRAW_3D -> draw3dRepository;
      default -> throw new IllegalArgumentException("引数が適切ではありません");
    };
  }


}
