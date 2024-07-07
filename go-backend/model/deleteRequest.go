package model

type DeleteRequest struct {
	ImageURL string `json:"image_url" binding:"required"`
}
