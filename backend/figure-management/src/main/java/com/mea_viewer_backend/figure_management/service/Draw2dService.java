package com.mea_viewer_backend.figure_management.service;

import com.mea_viewer_backend.figure_management.dto.DeleteAllRequestDto;
import com.mea_viewer_backend.figure_management.model.Draw2dEntity;
import com.mea_viewer_backend.figure_management.repository.Draw2dRepository;
import java.net.MalformedURLException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class Draw2dService {

  private final Draw2dRepository draw2dRepository;
  private final MinioService minioService;

  public List<Draw2dEntity> getDraw2dImages(String fileName) {
    return draw2dRepository.getDraw2dImages(fileName);
  }

  public void deleteDraw2dImage(String imageUrl) throws MalformedURLException {
    minioService.deleteFile(imageUrl);
    draw2dRepository.deleteDraw2DImage(imageUrl);
  }

  public void deleteAllDraw2dImages(DeleteAllRequestDto deleteAllRequestDto) {
    minioService.deleteObjectsInDirectory(deleteAllRequestDto.getDirectory());
    draw2dRepository.deleteAllDraw2dImages(deleteAllRequestDto.getFileName());
  }

}
