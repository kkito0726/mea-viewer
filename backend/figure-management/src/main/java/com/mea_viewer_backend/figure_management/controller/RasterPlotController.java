package com.mea_viewer_backend.figure_management.controller;

import com.mea_viewer_backend.figure_management.dto.DeleteAllRequestDto;
import com.mea_viewer_backend.figure_management.dto.DeleteRequestDto;
import com.mea_viewer_backend.figure_management.model.RasterPlotEntity;
import com.mea_viewer_backend.figure_management.service.RasterPlotService;
import java.net.MalformedURLException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping(path = RasterPlotController.BASE_URL)
public class RasterPlotController {

  public static final String BASE_URL = "crud/rasterPlot";
  private final RasterPlotService rasterPlotService;

  @GetMapping("/{fileName}")
  public ResponseEntity<List<RasterPlotEntity>> getRasterPlotImages(@PathVariable String fileName) {
    return ResponseEntity.ok(rasterPlotService.getRasterPlotImages(fileName));
  }

  @DeleteMapping("")
  public ResponseEntity<Void> deleteRasterPlotImage(@RequestBody DeleteRequestDto deleteRequestDto)
      throws MalformedURLException {
    rasterPlotService.deleteRasterPlotImage(deleteRequestDto.getImageUrl());
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/all")
  public ResponseEntity<Void> deleteAllRasterPlotImages(@RequestBody DeleteAllRequestDto deleteAllRequestDto) {
    rasterPlotService.deleteAllRasterPlotImage(deleteAllRequestDto);
    return ResponseEntity.noContent().build();
  }

}
