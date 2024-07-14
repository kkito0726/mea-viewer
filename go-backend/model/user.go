package model

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name          string        `json:"name" gorm:"unique" binding:"required"`
	Email         string        `json:"email" binding:"required,email"`
	Password      string        `json:"password" binding:"required"`
	UserAuthToken UserAuthToken `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

type UserAuthToken struct {
	gorm.Model
	UserID uint   `json:"user_id"`
	Token  string `json:"token"`
}

type UserResponse struct {
	ID    uint   `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Token string `json:"token"`
}

type CreateUserRequest struct {
	Name     string `json:"name" gorm:"unique"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginUserRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Header struct {
	UserID uint   `header:"user_id"`
	Token  string `header:"auth_token"`
}
