package com.mea_viewer_backend.figure_management.controller;

import com.mea_viewer_backend.figure_management.dto.DeleteAllRequestDto;
import com.mea_viewer_backend.figure_management.dto.DeleteRequestDto;
import com.mea_viewer_backend.figure_management.enums.FigType;
import com.mea_viewer_backend.figure_management.model.ImageModel;
import com.mea_viewer_backend.figure_management.service.ImageService;
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
@RequestMapping(path = Draw2dController.BASE_URL)
public class Draw2dController {

  public static final String BASE_URL = "crud/draw2d";
  private final ImageService imageService;

  @GetMapping("/{fileName}")
  public ResponseEntity<List<ImageModel>> getDraw2dImages(@PathVariable String fileName) {
    return ResponseEntity.ok(imageService.getImages(FigType.DRAW_2D, fileName));
  }

  @DeleteMapping("")
  public ResponseEntity<Void> deleteDraw2dImage(@RequestBody DeleteRequestDto deleteRequestDto)
      throws MalformedURLException {
    imageService.deleteImage(FigType.DRAW_2D, deleteRequestDto.getImageUrl());
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/all")
  public ResponseEntity<Void> deleteAllDraw2dImages(
      @RequestBody DeleteAllRequestDto deleteAllRequestDto) {
    imageService.deleteAllImages(FigType.DRAW_2D, deleteAllRequestDto);
    return ResponseEntity.noContent().build();
  }

}
