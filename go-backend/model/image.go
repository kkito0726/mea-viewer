package model

import (
	"time"

	"gorm.io/gorm"
)

type Image struct {
	ID        int       `json:"id"`
	Ch        int       `json:"ch"`
	FigType   string    `json:"fig_type"`
	ImageUrl  string    `json:"image_url"`
	FileName  string    `json:"file_name"`
	CreatedAt time.Time `json:"created_at"`
}

type FigImage struct {
	gorm.Model
	Ch       int    `json:"ch"`
	FigType  string `json:"fig_type"`
	ImageUrl string `json:"image_url"`
	FileName string `json:"file_name"`
}

type ShowAllImage struct {
	gorm.Model
	Ch       int    `json:"ch"`
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
	Ch       int    `json:"ch"`
	ImageUrl string `json:"image_url"`
	FileName string `json:"file_name"`
}

type RasterPlotImage struct {
	gorm.Model
	Ch       int    `json:"ch"`
	ImageUrl string `json:"image_url"`
	FileName string `json:"file_name"`
}

type Draw2dImage struct {
	gorm.Model
	Ch       int    `json:"ch"`
	ImageUrl string `json:"image_url"`
	FileName string `json:"file_name"`
}

type Draw3dImage struct {
	gorm.Model
	Ch       int    `json:"ch"`
	ImageUrl string `json:"image_url"`
	FileName string `json:"file_name"`
}

type PlotPeaksImage struct {
	gorm.Model
	Ch       int    `json:"ch"`
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
	FigType   string `json:"figType" binding:"required"`
	FileName  string `json:"file_name" binding:"required"`
}
