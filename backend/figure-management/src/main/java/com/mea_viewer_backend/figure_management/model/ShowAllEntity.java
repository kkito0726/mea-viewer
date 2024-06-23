package com.mea_viewer_backend.figure_management.model;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ShowAllEntity {
    private int id;
    private String imageUrl;
    private String fileName;
    private LocalDateTime createdAt;
}
