package com.mea_viewer_backend.figure_management.controller;

import com.mea_viewer_backend.figure_management.dto.DeleteAllRequestDto;
import com.mea_viewer_backend.figure_management.dto.DeleteRequestDto;
import com.mea_viewer_backend.figure_management.model.ShowAllEntity;
import com.mea_viewer_backend.figure_management.service.ShowAllService;
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
@RequestMapping(path = ShowAllController.BASE_URL)
public class ShowAllController {

  public static final String BASE_URL = "crud/showAll";
  private final ShowAllService showAllService;

  @GetMapping("")
  public ResponseEntity<String> health() {
    return ResponseEntity.ok("working this API!!");
  }

  @GetMapping("/{fileName}")
  public ResponseEntity<List<ShowAllEntity>> getShowAllImages(@PathVariable String fileName) {
    return ResponseEntity.ok(showAllService.getShowAllImages(fileName));
  }

  @DeleteMapping("")
  public ResponseEntity<Void> deleteShowAllImage(@RequestBody DeleteRequestDto deleteRequestDto)
      throws MalformedURLException {
    showAllService.deleteShowAllImage(deleteRequestDto.getImageUrl());
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/all")
  public ResponseEntity<Void> deleteAllShowAllImages(
      @RequestBody DeleteAllRequestDto deleteAllRequestDto) {
    showAllService.deleteAllShowAllImages(deleteAllRequestDto);
    return ResponseEntity.noContent().build();
  }

}
