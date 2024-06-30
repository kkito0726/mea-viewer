package com.mea_viewer_backend.figure_management.controller;

import com.mea_viewer_backend.figure_management.dto.DeleteAllRequestDto;
import com.mea_viewer_backend.figure_management.dto.DeleteRequestDto;
import com.mea_viewer_backend.figure_management.model.ShowAllEntity;
import com.mea_viewer_backend.figure_management.model.ShowSingleEntity;
import com.mea_viewer_backend.figure_management.service.ShowSingleService;
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
@RequestMapping(path = ShowSingleController.BASE_URL)
public class ShowSingleController {

  public static final String BASE_URL = "crud/showSingle";
  private final ShowSingleService showSingleService;

  @GetMapping("/{fileName}")
  public ResponseEntity<List<ShowSingleEntity>> getShowSingleImages(@PathVariable String fileName) {
    return ResponseEntity.ok(showSingleService.getShowSingleImages(fileName));
  }

  @DeleteMapping("")
  public ResponseEntity<Void> deleteShowSingleImage(@RequestBody DeleteRequestDto deleteRequestDto)
      throws MalformedURLException {
    showSingleService.deleteShowSingleImage(deleteRequestDto.getImageUrl());
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/all")
  public ResponseEntity<Void> deleteAllShowASingeImages(
      @RequestBody DeleteAllRequestDto deleteAllRequestDto) {
    showSingleService.deleteAllShowSingleImages(deleteAllRequestDto);
    return ResponseEntity.noContent().build();
  }

}
