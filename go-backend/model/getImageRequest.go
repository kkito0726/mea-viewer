package model

type GetImageRequest struct {
	FileName string `json:"file_name" binding:"required"`
}
