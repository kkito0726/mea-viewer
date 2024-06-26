package com.mea_viewer_backend.figure_management.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class DeleteRequestDto {
  @JsonProperty("image_url")
  private String imageUrl;

}
