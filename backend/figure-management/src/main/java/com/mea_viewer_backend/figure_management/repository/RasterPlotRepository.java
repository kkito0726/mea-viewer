package com.mea_viewer_backend.figure_management.repository;

import static com.jooq.generated.tables.RasterplotImage.RASTERPLOT_IMAGE;

import com.mea_viewer_backend.figure_management.model.RasterPlotEntity;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class RasterPlotRepository {

  private final DSLContext dslContext;

  public List<RasterPlotEntity> getRasterPlotImages(String fileName) {
    return dslContext.select()
        .from(RASTERPLOT_IMAGE)
        .where(RASTERPLOT_IMAGE.FILE_NAME.eq(fileName))
        .fetchInto(RasterPlotEntity.class);
  }

  public void deleteRasterPlotImage(String imageUrl) {
    dslContext.delete(RASTERPLOT_IMAGE)
        .where(RASTERPLOT_IMAGE.IMAGE_URL.eq(imageUrl))
        .execute();
  }

  public void deleteAllRasterPlotImages(String fileName) {
    dslContext.delete(RASTERPLOT_IMAGE)
        .where(RASTERPLOT_IMAGE.FILE_NAME.eq(fileName))
        .execute();
  }

}
