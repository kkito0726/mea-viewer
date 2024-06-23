package com.mea_viewer_backend.figure_management.repository;

import com.jooq.generated.tables.ShowAllImage;
import com.mea_viewer_backend.figure_management.model.ShowAllEntity;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class ShowAllRepository {

  private final DSLContext dslContext;

  public List<ShowAllEntity> getShowAllImages(String fileName) {
    return dslContext.select()
        .from(ShowAllImage.SHOW_ALL_IMAGE)
        .where(ShowAllImage.SHOW_ALL_IMAGE.FILE_NAME.eq(fileName))
        .fetchInto(ShowAllEntity.class);
  }

  public void deleteShowAllImage(String imageUrl) {
    dslContext.delete(ShowAllImage.SHOW_ALL_IMAGE)
        .where(ShowAllImage.SHOW_ALL_IMAGE.IMAGE_URL.eq(imageUrl))
        .execute();
  }

  public void deleteAllShowAllImages(String fileName) {
    dslContext.delete(ShowAllImage.SHOW_ALL_IMAGE)
        .where(ShowAllImage.SHOW_ALL_IMAGE.FILE_NAME.eq(fileName))
        .execute();
  }
}
