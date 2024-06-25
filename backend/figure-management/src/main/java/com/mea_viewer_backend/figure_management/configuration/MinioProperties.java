package com.mea_viewer_backend.figure_management.configuration;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "minio")
@Data
public class MinioProperties {
  private String endpoint;
  private String accessKey;
  private String secretKey;

}
