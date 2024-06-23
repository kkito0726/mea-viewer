package com.mea_viewer_backend.figure_management.service;

import com.mea_viewer_backend.figure_management.model.ShowAllEntity;
import com.mea_viewer_backend.figure_management.repository.ShowAllRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShowAllService {
  private final ShowAllRepository showAllRepository;

  public List<ShowAllEntity> getShowAllImages(String fileName) {
    return showAllRepository.getShowAllImages(fileName);
  }

  public void deleteShowAllImage(String imageUrl) {
    showAllRepository.deleteShowAllImage(imageUrl);
  }

  public void deleteAllShowAllImages(String fileName) {
    showAllRepository.deleteAllShowAllImages(fileName);
  }

}
