package model

type DeleteAllRequest struct {
	Directory string `json:"directory" binding:"required"`
	FileName  string `json:"file_name" binding:"required"`
}
