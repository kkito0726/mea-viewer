package com.mea_viewer_backend.figure_management.repository;

import static com.jooq.generated.tables.Draw2dImage.DRAW2D_IMAGE;

import com.jooq.generated.tables.Draw2dImage;
import com.mea_viewer_backend.figure_management.model.Draw2dEntity;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class Draw2dRepository {

  private final DSLContext dslContext;

  public List<Draw2dEntity> getDraw2dImages(String fileName) {
    return dslContext.select()
        .from(DRAW2D_IMAGE)
        .where(DRAW2D_IMAGE.FILE_NAME.eq(fileName))
        .fetchInto(Draw2dEntity.class);
  }

  public void deleteDraw2DImage(String imageUrl) {
    dslContext.delete(DRAW2D_IMAGE)
        .where(DRAW2D_IMAGE.IMAGE_URL.eq(imageUrl))
        .execute();
  }

  public void deleteAllDraw2dImages(String fileName) {
    dslContext.delete(DRAW2D_IMAGE)
        .where(DRAW2D_IMAGE.FILE_NAME.eq(fileName))
        .execute();
  }
}
