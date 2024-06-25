package com.mea_viewer_backend.figure_management.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ShowAllEntity {

  private int id;
  @JsonProperty("image_url")
  private String imageUrl;
  @JsonProperty("file_name")
  private String fileName;
  @JsonProperty("created_at")
  private LocalDateTime createdAt;
}
