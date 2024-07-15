package model

import (
	"time"

	"gorm.io/gorm"
)

type Image struct {
	ID        int       `json:"id"`
	Ch        int       `json:"ch"`
	ImageUrl  string    `json:"image_url"`
	Filename  string    `json:"file_name"`
	CreatedAt time.Time `json:"created_at"`
}

type ShowAllImage struct {
	gorm.Model
	ImageUrl string `json:"image_url"`
	FileName string `json:"file_name"`
}

type ShowSingleImage struct {
	gorm.Model
	Ch       int    `json:"ch"`
	ImageUrl string `json:"image_url"`
	FileName string `json:"file_name"`
}

type ShowDetectionImage struct {
	gorm.Model
	ImageUrl  string    `json:"image_url"`
	FileName  string    `json:"file_name"`
	CreatedAt time.Time `json:"created_at"`
}

type RasterPlotImage struct {
	gorm.Model
	ImageUrl string `json:"image_url"`
	FileName string `json:"file_name"`
}

type Draw2dImage struct {
	gorm.Model
	ImageUrl string `json:"image_url"`
	FileName string `json:"file_name"`
}

type Draw3dImage struct {
	gorm.Model
	ImageUrl string `json:"image_url"`
	FileName string `json:"file_name"`
}

type GetImageRequest struct {
	FileName string `json:"file_name" binding:"required"`
}

type DeleteRequest struct {
	ImageURL string `json:"image_url" binding:"required"`
}

type DeleteAllRequest struct {
	Directory string `json:"directory" binding:"required"`
	FileName  string `json:"file_name" binding:"required"`
}
