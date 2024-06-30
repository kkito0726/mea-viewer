package com.mea_viewer_backend.figure_management.controller;

import com.mea_viewer_backend.figure_management.dto.DeleteAllRequestDto;
import com.mea_viewer_backend.figure_management.dto.DeleteRequestDto;
import com.mea_viewer_backend.figure_management.model.ShowDetectionEntity;
import com.mea_viewer_backend.figure_management.service.ShowDetectionService;
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
@RequestMapping(path = ShowDetectionController.BASE_URL)
public class ShowDetectionController {

  public static final String BASE_URL = "crud/showDetection";
  private final ShowDetectionService showDetectionService;

  @GetMapping("/{fileName}")
  public ResponseEntity<List<ShowDetectionEntity>> getShowDetectionImages(
      @PathVariable String fileName) {
    return ResponseEntity.ok(showDetectionService.getShowDetectionImages(fileName));
  }

  @DeleteMapping("")
  public ResponseEntity<Void> deleteShowDetectionImage(
      @RequestBody DeleteRequestDto deleteRequestDto)
      throws MalformedURLException {
    showDetectionService.deleteShowDetectionImage(deleteRequestDto.getImageUrl());
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/all")
  public ResponseEntity<Void> deleteAllShowDetectionImages(
      @RequestBody DeleteAllRequestDto deleteAllRequestDto) {
    showDetectionService.deleteAllShowDetectionImages(deleteAllRequestDto);
    return ResponseEntity.noContent().build();
  }


}
