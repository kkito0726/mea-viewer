package com.mea_viewer_backend.figure_management.repository;

import static com.jooq.generated.tables.ShowSingleImage.SHOW_SINGLE_IMAGE;

import com.mea_viewer_backend.figure_management.model.ShowSingleEntity;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ShowSingleRepository {

  private final DSLContext dslContext;

  public List<ShowSingleEntity> getShowSingleImages(String fileName) {
    return dslContext.select()
        .from(SHOW_SINGLE_IMAGE)
        .where(SHOW_SINGLE_IMAGE.FILE_NAME.eq(fileName))
        .fetchInto(ShowSingleEntity.class);
  }

  public void deleteShowSingleImage(String imageUrl) {
    dslContext.delete(SHOW_SINGLE_IMAGE)
        .where(SHOW_SINGLE_IMAGE.IMAGE_URL.eq(imageUrl))
        .execute();
  }

  public void deleteAllShowSingleImages(String fileName) {
    dslContext.delete(SHOW_SINGLE_IMAGE)
        .where(SHOW_SINGLE_IMAGE.FILE_NAME.eq(fileName))
        .execute();
  }

}
