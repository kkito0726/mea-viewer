package com.mea_viewer_backend.figure_management.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class ImageModel {
  private int id;
  @JsonProperty("ch")
  private int ch;
  @JsonProperty("image_url")
  private String imageUrl;
  @JsonProperty("file_name")
  private String fileName;
  @JsonProperty("created_at")
  private LocalDateTime createdAt;

  public static ImageModel create(int ch, String imageUrl, String fileName) {
    ImageModel imageModel = new ImageModel();
    imageModel.setCh(ch);
    imageModel.setImageUrl(imageUrl);
    imageModel.setFileName(fileName);
    return imageModel;
  }
}
