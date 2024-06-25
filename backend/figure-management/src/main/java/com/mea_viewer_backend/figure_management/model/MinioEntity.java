package com.mea_viewer_backend.figure_management.model;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MinioEntity {

  String bucketName;
  String objectName;

}
