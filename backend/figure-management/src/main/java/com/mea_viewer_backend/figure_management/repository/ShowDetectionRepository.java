package com.mea_viewer_backend.figure_management.repository;

import static com.jooq.generated.tables.ShowdetectionImage.SHOWDETECTION_IMAGE;

import com.mea_viewer_backend.figure_management.model.ShowDetectionEntity;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ShowDetectionRepository {

  private final DSLContext dslContext;

  public List<ShowDetectionEntity> getShowDetectionImages(String fileName) {
    return dslContext.select()
        .from(SHOWDETECTION_IMAGE)
        .where(SHOWDETECTION_IMAGE.FILE_NAME.eq(fileName))
        .fetchInto(ShowDetectionEntity.class);
  }

  public void deleteShowDetectionImage(String imageUrl) {
    dslContext.delete(SHOWDETECTION_IMAGE)
        .where(SHOWDETECTION_IMAGE.IMAGE_URL.eq(imageUrl))
        .execute();
  }

  public void deleteAllShowDetectionImages(String fileName) {
    dslContext.delete(SHOWDETECTION_IMAGE)
        .where(SHOWDETECTION_IMAGE.FILE_NAME.eq(fileName))
        .execute();
  }

}
