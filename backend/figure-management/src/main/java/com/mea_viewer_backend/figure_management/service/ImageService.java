package com.mea_viewer_backend.figure_management.service;

import com.mea_viewer_backend.figure_management.dto.DeleteAllRequestDto;
import com.mea_viewer_backend.figure_management.enums.FigType;
import com.mea_viewer_backend.figure_management.factory.ImageRepositoryFactory;
import com.mea_viewer_backend.figure_management.lib.MeaPlot;
import com.mea_viewer_backend.figure_management.model.ImageModel;
import com.mea_viewer_backend.figure_management.model.form.ImageRequest;
import io.minio.errors.ErrorResponseException;
import io.minio.errors.InsufficientDataException;
import io.minio.errors.InternalException;
import io.minio.errors.InvalidResponseException;
import io.minio.errors.ServerException;
import io.minio.errors.XmlParserException;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.net.MalformedURLException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ImageService {

  private final ImageRepositoryFactory imageRepositoryFactory;
  private final MinioService minioService;
  private final MeaPlot meaPlot;

  public List<ImageModel> createImages(FigType figType, ImageRequest imageRequest, float[][] sliceMeaData) {
    List<ImageModel> imageModels = new ArrayList<>();
    IntStream.range(1, sliceMeaData.length).forEach(i -> {
      try {
        // Figの描画
        BufferedImage bufferedImage = meaPlot.showSingle(
            sliceMeaData,
            i,
            imageRequest.createFormValue()
        );

        // minioへ画像の保存
        String imageUrl = minioService.saveImage(
            bufferedImage,
            imageRequest.createFormDto(FigType.SHOW_SINGLE, imageRequest.chs[i - 1]
            ));

        // DBへinsert
        ImageModel imageModel = ImageModel.create(imageRequest.chs[i], imageUrl, imageRequest.fileName);
        imageRepositoryFactory.getRepository(figType).insertImage(imageModel);

        imageModels.add(imageModel);
      } catch (IOException | ServerException | InsufficientDataException | ErrorResponseException |
               NoSuchAlgorithmException | InvalidKeyException | InvalidResponseException |
               XmlParserException | InternalException e) {
        throw new RuntimeException(e);
      }

    });

    return imageModels;
  }

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
