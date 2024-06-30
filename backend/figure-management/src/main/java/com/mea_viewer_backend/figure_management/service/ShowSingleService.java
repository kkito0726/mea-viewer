package com.mea_viewer_backend.figure_management.service;

import com.mea_viewer_backend.figure_management.dto.DeleteAllRequestDto;
import com.mea_viewer_backend.figure_management.model.ShowSingleEntity;
import com.mea_viewer_backend.figure_management.repository.ShowSingleRepository;
import java.net.MalformedURLException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShowSingleService {

  private final ShowSingleRepository showSingleRepository;
  private final MinioService minioService;


 public List<ShowSingleEntity> getShowSingleImages(String fileName) {
    return showSingleRepository.getShowSingleImages(fileName);
  }

  public void deleteShowSingleImage(String imageUrl) throws MalformedURLException {
    minioService.deleteFile(imageUrl);
    showSingleRepository.deleteShowSingleImage(imageUrl);
  }

  public void deleteAllShowSingleImages(DeleteAllRequestDto deleteAllRequestDto) {
    minioService.deleteObjectsInDirectory(deleteAllRequestDto.getDirectory());
    showSingleRepository.deleteAllShowSingleImages(deleteAllRequestDto.getFileName());
  }
}
