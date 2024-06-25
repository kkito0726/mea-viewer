package com.mea_viewer_backend.figure_management.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DeleteAllRequestDto {
  @JsonProperty("directory")
  private String directory;

  @JsonProperty("file_name")
  private String fileName;


}
