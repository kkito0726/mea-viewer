package model

import (
	"gorm.io/gorm"
)

type FigImage struct {
	gorm.Model
	Ch       int    `json:"ch"`
	FigType  string `json:"fig_type"`
	ImageUrl string `json:"image_url"`
	FileName string `json:"file_name"`
}

type GetImageRequest struct {
	FigType  string `json:"figType" binding:"required"`
	FileName string `json:"file_name" binding:"required"`
}

type DeleteRequest struct {
	ImageURL string `json:"image_url" binding:"required"`
}

type DeleteAllRequest struct {
	Directory string `json:"directory" binding:"required"`
	FileName  string `json:"file_name" binding:"required"`
}
