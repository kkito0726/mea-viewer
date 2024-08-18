package com.mea_viewer_backend.figure_management.repository.image.impl;

import static com.jooq.generated.Tables.SHOW_DETECTION_IMAGES;

import com.mea_viewer_backend.figure_management.model.ImageModel;
import com.mea_viewer_backend.figure_management.repository.image.ImageRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ShowDetectionRepository implements ImageRepository {

  private final DSLContext dslContext;

  @Override
  public void insertImage(ImageModel imageModel) {

  }

  public List<ImageModel> getImages(String fileName) {
    return dslContext.select()
        .from(SHOW_DETECTION_IMAGES)
        .where(SHOW_DETECTION_IMAGES.FILE_NAME.eq(fileName))
        .fetchInto(ImageModel.class);
  }

  public void deleteImage(String imageUrl) {
    dslContext.delete(SHOW_DETECTION_IMAGES)
        .where(SHOW_DETECTION_IMAGES.IMAGE_URL.eq(imageUrl))
        .execute();
  }

  public void deleteAllImages(String fileName) {
    dslContext.delete(SHOW_DETECTION_IMAGES)
        .where(SHOW_DETECTION_IMAGES.FILE_NAME.eq(fileName))
        .execute();
  }

}
