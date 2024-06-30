package com.mea_viewer_backend.figure_management.service;

import com.mea_viewer_backend.figure_management.dto.DeleteAllRequestDto;
import com.mea_viewer_backend.figure_management.model.ShowAllEntity;
import com.mea_viewer_backend.figure_management.repository.ShowAllRepository;
import java.net.MalformedURLException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShowAllService {
  private final ShowAllRepository showAllRepository;
  private final MinioService minioService;

  public List<ShowAllEntity> getShowAllImages(String fileName) {
    return showAllRepository.getShowAllImages(fileName);
  }

  public void deleteShowAllImage(String imageUrl) throws MalformedURLException {
    minioService.deleteFile(imageUrl);
    showAllRepository.deleteShowAllImage(imageUrl);
  }

  public void deleteAllShowAllImages(DeleteAllRequestDto deleteAllRequestDto) {
    minioService.deleteObjectsInDirectory(deleteAllRequestDto.getDirectory());
    showAllRepository.deleteAllShowAllImages(deleteAllRequestDto.getFileName());
  }

}
