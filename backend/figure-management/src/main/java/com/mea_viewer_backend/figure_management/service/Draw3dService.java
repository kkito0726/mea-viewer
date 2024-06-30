package com.mea_viewer_backend.figure_management.service;

import com.mea_viewer_backend.figure_management.dto.DeleteAllRequestDto;
import com.mea_viewer_backend.figure_management.model.Draw3dEntity;
import com.mea_viewer_backend.figure_management.repository.Draw3dRepository;
import java.net.MalformedURLException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class Draw3dService {

  private final Draw3dRepository draw3dRepository;
  private final MinioService minioService;

  public List<Draw3dEntity> getDraw3dImages(String fileName) {
    return draw3dRepository.getDraw3dImages(fileName);
  }

  public void deleteDraw3dImage(String imageUrl) throws MalformedURLException {
    minioService.deleteFile(imageUrl);
    draw3dRepository.deleteDraw3dImage(imageUrl);
  }

  public void deleteAllDraw3dImages(DeleteAllRequestDto deleteAllRequestDto) {
    minioService.deleteObjectsInDirectory(deleteAllRequestDto.getDirectory());
    draw3dRepository.deleteAllDraw3dImages(deleteAllRequestDto.getFileName());
  }

}
