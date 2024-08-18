package com.mea_viewer_backend.figure_management.repository.image;

import com.mea_viewer_backend.figure_management.model.ImageModel;
import java.util.List;

public interface ImageRepository {

  void insertImage(ImageModel imageModel);
  List<ImageModel> getImages(String fileName);
  void deleteImage(String imageUrl);
  void deleteAllImages(String fileName);

}
