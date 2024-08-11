package com.mea_viewer_backend.figure_management.repository.image.impl;

import static com.jooq.generated.Tables.DRAW3D_IMAGES;

import com.mea_viewer_backend.figure_management.model.ImageModel;
import com.mea_viewer_backend.figure_management.repository.image.ImageRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class Draw3dRepository implements ImageRepository {
  private final DSLContext dslContext;

  public List<ImageModel> getImages(String fileName) {
    return dslContext.select()
        .from(DRAW3D_IMAGES)
        .where(DRAW3D_IMAGES.FILE_NAME.eq(fileName))
        .fetchInto(ImageModel.class);
  }

  public void deleteImage(String imageUrl) {
    dslContext.delete(DRAW3D_IMAGES)
        .where(DRAW3D_IMAGES.IMAGE_URL.eq(imageUrl))
        .execute();
  }

  public void deleteAllImages(String fileName) {
    dslContext.delete(DRAW3D_IMAGES)
        .where(DRAW3D_IMAGES.FILE_NAME.eq(fileName))
        .execute();
  }

}
