package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kkito0726/mea-viewer/enum"
	"github.com/kkito0726/mea-viewer/errors"
	"github.com/kkito0726/mea-viewer/model"
	"github.com/kkito0726/mea-viewer/repository"
	"github.com/kkito0726/mea-viewer/service"
)

var userService = service.NewUserService(&repository.UserRepository{})

func CreateUserController(c *gin.Context) {
	userID := c.MustGet("userID").(uint)
	token := c.MustGet("token").(string)

	var createUserRequest model.CreateUserRequest

	if err := c.ShouldBindBodyWithJSON(&createUserRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": errors.BadRequestError(enum.C013)})
		return
	}

	userResponse, err := userService.CreateUser(userID, token, &createUserRequest)
	if err != nil {
		err.Logging()
		c.JSON(err.StatusCode, gin.H{"error": err})
		return
	}

	c.JSON(http.StatusOK, userResponse)
}

func LoginUserController(c *gin.Context) {
	var req model.LoginUserRequest
	if err := c.ShouldBindBodyWithJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": errors.BadRequestError(enum.C013)})
		return
	}

	userResponse, err := userService.LoginUser(&req)
	if err != nil {
		err.Logging()
		c.JSON(err.StatusCode, gin.H{"error": err})
		return
	}

	c.JSON(http.StatusOK, userResponse)
}

func LogoutUserController(c *gin.Context) {
	userID := c.MustGet("userID").(uint)
	token := c.MustGet("token").(string)

	if err := userService.LogoutUser(userID, token); err != nil {
		err.Logging()
		c.JSON(err.StatusCode, gin.H{"error": err})
	}
	c.JSON(http.StatusNoContent, nil)
}

func UpdateUserController(c *gin.Context) {
	userID := c.MustGet("userID").(uint)
	token := c.MustGet("token").(string)

	var updateUserRequest model.UpdateUserRequest
	if err := c.ShouldBindBodyWithJSON(&updateUserRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": errors.BadRequestError(enum.C013)})
		return
	}

	targetUserID := c.Param("id")

	userResponse, err := userService.UpdateUser(userID, token, &updateUserRequest, targetUserID)
	if err != nil {
		err.Logging()
		c.JSON(err.StatusCode, gin.H{"error": err})
		return
	}

	c.JSON(http.StatusOK, userResponse)
}

func DeleteUserController(c *gin.Context) {
	userID := c.MustGet("userID").(uint)
	token := c.MustGet("token").(string)

	if err := userService.DeleteUser(userID, token); err != nil {
		err.Logging()
		c.JSON(err.StatusCode, gin.H{"error": err})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

func UpdatePasswordController(c *gin.Context) {
	userID := c.MustGet("userID").(uint)

	var req model.ResetPasswordRequest
	if err := c.ShouldBindBodyWithJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": errors.BadRequestError(enum.C013)})
		return
	}

	if err := userService.UpdatePassword(userID, &req); err != nil {
		err.Logging()
		c.JSON(err.StatusCode, gin.H{"error": err})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password reset successfully"})
}

func InitializePasswordController(c *gin.Context) {
	requestUserID := c.MustGet("userID").(uint)
	targetUserIDStr := c.Param("id")

	newPassword, err := userService.InitializePassword(requestUserID, targetUserIDStr)
	if err != nil {
		err.Logging()
		c.JSON(err.StatusCode, gin.H{"error": err})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password initialized successfully", "new_password": newPassword})
}
