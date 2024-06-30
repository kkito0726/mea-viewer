package com.mea_viewer_backend.figure_management.repository;

import static com.jooq.generated.tables.Draw3dImage.DRAW3D_IMAGE;

import com.jooq.generated.tables.Draw2dImage;
import com.jooq.generated.tables.Draw3dImage;
import com.mea_viewer_backend.figure_management.model.Draw3dEntity;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class Draw3dRepository {
  private final DSLContext dslContext;

  public List<Draw3dEntity> getDraw3dImages(String fileName) {
    return dslContext.select()
        .from(DRAW3D_IMAGE)
        .where(DRAW3D_IMAGE.FILE_NAME.eq(fileName))
        .fetchInto(Draw3dEntity.class);
  }

  public void deleteDraw3dImage(String imageUrl) {
    dslContext.delete(DRAW3D_IMAGE)
        .where(DRAW3D_IMAGE.IMAGE_URL.eq(imageUrl))
        .execute();
  }

  public void deleteAllDraw3dImages(String fileName) {
    dslContext.delete(DRAW3D_IMAGE)
        .where(DRAW3D_IMAGE.FILE_NAME.eq(fileName))
        .execute();
  }

}
