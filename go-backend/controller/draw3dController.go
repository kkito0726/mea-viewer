package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kkito0726/mea-viewer/model"
	"github.com/kkito0726/mea-viewer/repository"
	"github.com/kkito0726/mea-viewer/service"
)

const DRAW3D_TABLE = "draw3d_image"

func GetDraw3dController(c *gin.Context) {
	getImageRequest := model.GetImageRequest{
		FileName: c.Param("file_name"),
	}

	service := service.ImageService{
		ImageRepository: &repository.ImageRepository{
			TableName: DRAW3D_TABLE,
		},
	}

	images := service.GetImages(&getImageRequest)

	c.JSON(http.StatusOK, images)
}

func DeleteDraw3dController(c *gin.Context) {
	var deleteImageRequest model.DeleteRequest

	// リクエストボディを構造体にバインド
	if err := c.ShouldBindJSON(&deleteImageRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	service := service.ImageService{
		ImageRepository: &repository.ImageRepository{
			TableName: DRAW3D_TABLE,
		},
	}

	service.DeleteImage(&deleteImageRequest)
	c.Status(http.StatusNoContent)
}

func DeleteAllDraw3dController(c *gin.Context) {
	var deleteAllRequest model.DeleteAllRequest

	// リクエストボディを構造体にバインド
	if err := c.ShouldBindJSON(&deleteAllRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	service := service.ImageService{
		ImageRepository: &repository.ImageRepository{
			TableName: DRAW3D_TABLE,
		},
	}

	service.DeleteAllImage(&deleteAllRequest)
	c.Status(http.StatusNoContent)
}
