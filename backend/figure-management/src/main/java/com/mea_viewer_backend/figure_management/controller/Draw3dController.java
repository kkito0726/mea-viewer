package com.mea_viewer_backend.figure_management.controller;

import com.mea_viewer_backend.figure_management.dto.DeleteAllRequestDto;
import com.mea_viewer_backend.figure_management.dto.DeleteRequestDto;
import com.mea_viewer_backend.figure_management.model.Draw2dEntity;
import com.mea_viewer_backend.figure_management.model.Draw3dEntity;
import com.mea_viewer_backend.figure_management.service.Draw3dService;
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
  private final Draw3dService draw3dService;

  @GetMapping("/{fileName}")
  public ResponseEntity<List<Draw3dEntity>> getDraw3dImages(@PathVariable String  fileName) {
    return ResponseEntity.ok(draw3dService.getDraw3dImages(fileName));
  }

  @DeleteMapping("")
  public ResponseEntity<Void> deleteDraw3dImage(@RequestBody DeleteRequestDto deleteRequestDto)
      throws MalformedURLException {
    draw3dService.deleteDraw3dImage(deleteRequestDto.getImageUrl());
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/all")
  public ResponseEntity<Void> deleteAllDraw3dImages(@RequestBody DeleteAllRequestDto deleteAllRequestDto) {
    draw3dService.deleteAllDraw3dImages(deleteAllRequestDto);
    return ResponseEntity.noContent().build();
  }

}
