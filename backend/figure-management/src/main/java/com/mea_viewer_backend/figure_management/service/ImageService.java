package com.mea_viewer_backend.figure_management.service;

import com.mea_viewer_backend.figure_management.dto.DeleteAllRequestDto;
import com.mea_viewer_backend.figure_management.enums.FigType;
import com.mea_viewer_backend.figure_management.factory.ImageRepositoryFactory;
import com.mea_viewer_backend.figure_management.model.ImageModel;
import java.net.MalformedURLException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ImageService {

  private final ImageRepositoryFactory imageRepositoryFactory;
  private final MinioService minioService;

  public List<ImageModel> getImages(FigType figType, String fileName) {
    return imageRepositoryFactory.getRepository(figType).getImages(fileName);
  }

  public void deleteImage(FigType figType, String imageUrl) throws MalformedURLException {
    minioService.deleteFile(imageUrl);
    imageRepositoryFactory.getRepository(figType).deleteImage(imageUrl);
  }

  public void deleteAllImages(FigType figType, DeleteAllRequestDto deleteAllRequestDto) {
    minioService.deleteObjectsInDirectory(deleteAllRequestDto.getDirectory());
    imageRepositoryFactory.getRepository(figType)
        .deleteAllImages(deleteAllRequestDto.getFileName());
  }
}
