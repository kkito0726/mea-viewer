package com.mea_viewer_backend.figure_management.service;

import com.mea_viewer_backend.figure_management.dto.DeleteAllRequestDto;
import com.mea_viewer_backend.figure_management.model.ShowDetectionEntity;
import com.mea_viewer_backend.figure_management.repository.ShowDetectionRepository;
import java.net.MalformedURLException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShowDetectionService {

  private final ShowDetectionRepository showDetectionRepository;
  private final MinioService minioService;

  public List<ShowDetectionEntity> getShowDetectionImages(String fileName) {
    return showDetectionRepository.getShowDetectionImages(fileName);
  }

  public void deleteShowDetectionImage(String imageUrl) throws MalformedURLException {
    minioService.deleteFile(imageUrl);
    showDetectionRepository.deleteShowDetectionImage(imageUrl);
  }

  public void deleteAllShowDetectionImages(DeleteAllRequestDto deleteAllRequestDto) {
    minioService.deleteObjectsInDirectory(deleteAllRequestDto.getDirectory());
    showDetectionRepository.deleteAllShowDetectionImages(deleteAllRequestDto.getFileName());
  }

}
