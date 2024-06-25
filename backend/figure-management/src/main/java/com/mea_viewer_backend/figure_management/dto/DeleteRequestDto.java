package com.mea_viewer_backend.figure_management.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DeleteRequestDto {
  @JsonProperty("image_url")
  private String imageUrl;

}
