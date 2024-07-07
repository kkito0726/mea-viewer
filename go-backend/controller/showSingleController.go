package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kkito0726/mea-viewer/model"
	"github.com/kkito0726/mea-viewer/repository"
	"github.com/kkito0726/mea-viewer/service"
)

const SHOW_SINGLE_TABLE = "show_single_image"

func GetShowSingleController(c *gin.Context) {
	getImageRequest := model.GetImageRequest{
		FileName: c.Param("file_name"),
	}

	service := service.ImageService{
		ImageRepository: &repository.ImageRepository{
			TableName: SHOW_SINGLE_TABLE,
		},
	}

	images := service.GetImages(&getImageRequest)

	c.JSON(http.StatusOK, images)
}

func DeleteShowSingleController(c *gin.Context) {
	var deleteImageRequest model.DeleteRequest

	// リクエストボディを構造体にバインド
	if err := c.ShouldBindJSON(&deleteImageRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	service := service.ImageService{
		ImageRepository: &repository.ImageRepository{
			TableName: SHOW_SINGLE_TABLE,
		},
	}

	service.DeleteImage(&deleteImageRequest)
	c.Status(http.StatusNoContent)
}

func DeleteAllShowSingleController(c *gin.Context) {
	var deleteAllRequest model.DeleteAllRequest

	// リクエストボディを構造体にバインド
	if err := c.ShouldBindJSON(&deleteAllRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	service := service.ImageService{
		ImageRepository: &repository.ImageRepository{
			TableName: SHOW_SINGLE_TABLE,
		},
	}

	service.DeleteAllImage(&deleteAllRequest)
	c.Status(http.StatusNoContent)
}
