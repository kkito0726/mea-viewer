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
@RequestMapping(path = Draw3dController.BASE_URL)
public class Draw3dController {
  public static final String BASE_URL = "crud/draw3d";
  private final ImageService imageService;

  @GetMapping("/{fileName}")
  public ResponseEntity<List<ImageModel>> getDraw3dImages(@PathVariable String  fileName) {
    return ResponseEntity.ok(imageService.getImages(FigType.DRAW_3D, fileName));
  }

  @DeleteMapping("")
  public ResponseEntity<Void> deleteDraw3dImage(@RequestBody DeleteRequestDto deleteRequestDto)
      throws MalformedURLException {
    imageService.deleteImage(FigType.DRAW_3D, deleteRequestDto.getImageUrl());
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/all")
  public ResponseEntity<Void> deleteAllDraw3dImages(@RequestBody DeleteAllRequestDto deleteAllRequestDto) {
    imageService.deleteAllImages(FigType.DRAW_3D, deleteAllRequestDto);
    return ResponseEntity.noContent().build();
  }

}
