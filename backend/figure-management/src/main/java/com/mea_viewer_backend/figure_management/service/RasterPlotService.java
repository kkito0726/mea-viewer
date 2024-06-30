package com.mea_viewer_backend.figure_management.service;

import com.mea_viewer_backend.figure_management.dto.DeleteAllRequestDto;
import com.mea_viewer_backend.figure_management.model.RasterPlotEntity;
import com.mea_viewer_backend.figure_management.repository.RasterPlotRepository;
import java.net.MalformedURLException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RasterPlotService {
  private final RasterPlotRepository rasterPlotRepository;
  private final MinioService minioService;

  public List<RasterPlotEntity> getRasterPlotImages(String fileName) {
    return rasterPlotRepository.getRasterPlotImages(fileName);
  }

  public void deleteRasterPlotImage(String imageUrl) throws MalformedURLException {
    minioService.deleteFile(imageUrl);
    rasterPlotRepository.deleteRasterPlotImage(imageUrl);
  }

  public void deleteAllRasterPlotImage(DeleteAllRequestDto deleteAllRequestDto) {
    minioService.deleteObjectsInDirectory(deleteAllRequestDto.getDirectory());
    rasterPlotRepository.deleteAllRasterPlotImages(deleteAllRequestDto.getFileName());
  }

}
