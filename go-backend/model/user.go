package model

import (
	"github.com/kkito0726/mea-viewer/enum"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name          string        `json:"name" gorm:"unique" binding:"required"`
	Email         string        `json:"email" binding:"required,email"`
	Password      string        `json:"password" binding:"required"`
	Role          enum.Role     `json:"role" gorm:"default:'app_user'"`
	UserAuthToken UserAuthToken `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

type UserAuthToken struct {
	gorm.Model
	UserID uint   `json:"user_id"`
	Token  string `json:"token"`
}

type UserResponse struct {
	ID       uint      `json:"id"`
	Name     string    `json:"name"`
	Email    string    `json:"email"`
	Password string    `json:"password"`
	Role     enum.Role `json:"role"`
	Token    string    `json:"token"`
}

type CreateUserRequest struct {
	Name  string    `json:"name" binding:"required"`
	Email string    `json:"email" binding:"required,email"`
	Role  enum.Role `json:"role"`
}

type UpdateUserRequest struct {
	Name  string    `json:"name" binding:"required"`
	Email string    `json:"email" binding:"required,email"`
	Role  enum.Role `json:"role"`
}

type LoginUserRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type ResetPasswordRequest struct {
	CurrentPassword string `json:"current_password" binding:"required"`
	NewPassword     string `json:"new_password" binding:"required"`
}
