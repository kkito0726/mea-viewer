package com.mea_viewer_backend.figure_management.controller;

import com.mea_viewer_backend.figure_management.dto.DeleteAllRequestDto;
import com.mea_viewer_backend.figure_management.dto.DeleteRequestDto;
import com.mea_viewer_backend.figure_management.enums.FigType;
import com.mea_viewer_backend.figure_management.lib.MeaPlot;
import com.mea_viewer_backend.figure_management.lib.ReadBio;
import com.mea_viewer_backend.figure_management.model.ImageModel;
import com.mea_viewer_backend.figure_management.model.form.ImageRequest;
import com.mea_viewer_backend.figure_management.model.form.ReadFrame;
import com.mea_viewer_backend.figure_management.service.DecodeMeaService;
import com.mea_viewer_backend.figure_management.service.ImageService;
import com.mea_viewer_backend.figure_management.service.MinioService;
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
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;
import lombok.RequiredArgsConstructor;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequiredArgsConstructor
public class ShowSingleController {

  public static final String BASE_URL = "crud/showSingle";
  private final ImageService imageService;
  private final DecodeMeaService decodeMeaService;
  private final MeaPlot meaPlot;
  private final MinioService minioService;

  @PostMapping("/showSingle")
  public ResponseEntity<List<ImageModel>> createShowSingleImage(
      @RequestPart("jsonData") ImageRequest imageRequest,
      @RequestPart Map<String, MultipartFile> files
  ) throws IOException {
    float[][] sliceMeaData = decodeMeaService.readMEA(imageRequest, files);
    return ResponseEntity.ok(
        imageService.createImages(FigType.SHOW_SINGLE, imageRequest, sliceMeaData));

  }

  @GetMapping("crud/showSingle/{fileName}")
  public ResponseEntity<List<ImageModel>> getShowSingleImages(@PathVariable String fileName) {
    return ResponseEntity.ok(imageService.getImages(FigType.SHOW_SINGLE, fileName));
  }

  @DeleteMapping("crud/showSingle")
  public ResponseEntity<Void> deleteShowSingleImage(@RequestBody DeleteRequestDto deleteRequestDto)
      throws MalformedURLException {
    imageService.deleteImage(FigType.SHOW_SINGLE, deleteRequestDto.getImageUrl());
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("crud/showSingle/all")
  public ResponseEntity<Void> deleteAllShowASingeImages(
      @RequestBody DeleteAllRequestDto deleteAllRequestDto) {
    imageService.deleteAllImages(FigType.SHOW_SINGLE, deleteAllRequestDto);
    return ResponseEntity.noContent().build();
  }

}
