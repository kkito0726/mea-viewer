package model

import "time"

type Image struct {
	ID        int       `json:"id"`
	ImageUrl  string    `json:"image_url"`
	Filename  string    `json:"file_name"`
	CreatedAt time.Time `json:"created_at"`
}
