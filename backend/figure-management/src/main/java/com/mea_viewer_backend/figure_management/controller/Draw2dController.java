package com.mea_viewer_backend.figure_management.controller;

import com.mea_viewer_backend.figure_management.dto.DeleteAllRequestDto;
import com.mea_viewer_backend.figure_management.dto.DeleteRequestDto;
import com.mea_viewer_backend.figure_management.model.Draw2dEntity;
import com.mea_viewer_backend.figure_management.service.Draw2dService;
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
  private final Draw2dService draw2dService;

  @GetMapping("/{fileName}")
  public ResponseEntity<List<Draw2dEntity>> getDraw2dImages(@PathVariable String  fileName) {
    return ResponseEntity.ok(draw2dService.getDraw2dImages(fileName));
  }

  @DeleteMapping("")
  public ResponseEntity<Void> deleteDraw2dImage(@RequestBody DeleteRequestDto deleteRequestDto)
      throws MalformedURLException {
    draw2dService.deleteDraw2dImage(deleteRequestDto.getImageUrl());
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/all")
  public ResponseEntity<Void> deleteAllDraw2dImages(@RequestBody DeleteAllRequestDto deleteAllRequestDto) {
    draw2dService.deleteAllDraw2dImages(deleteAllRequestDto);
    return ResponseEntity.noContent().build();
  }

}
