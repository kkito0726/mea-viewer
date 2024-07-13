package model

import "time"

type Image struct {
	ID        int       `json:"id"`
	Ch        int       `json:"ch"`
	ImageUrl  string    `json:"image_url"`
	Filename  string    `json:"file_name"`
	CreatedAt time.Time `json:"created_at"`
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
