package com.mea_viewer_backend.figure_management.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Draw3dEntity {

  private int id;
  @JsonProperty("image_url")
  private String imageUrl;
  @JsonProperty("file_name")
  private String fileName;
  @JsonProperty("created_at")
  private LocalDateTime createdAt;
}
