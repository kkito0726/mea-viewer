package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kkito0726/mea-viewer/model"
	"github.com/kkito0726/mea-viewer/service"
)

const SHOW_SINGLE_TABLE = "show_single_images"

var ShowSingleService = service.NewImageService(SHOW_SINGLE_TABLE)

func GetShowSingleController(c *gin.Context) {
	getImageRequest := model.GetImageRequest{
		FileName: c.Param("file_name"),
	}

	images := ShowSingleService.GetImages(&getImageRequest)

	c.JSON(http.StatusOK, images)
}

func DeleteShowSingleController(c *gin.Context) {
	var deleteImageRequest model.DeleteRequest

	// リクエストボディを構造体にバインド
	if err := c.ShouldBindJSON(&deleteImageRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := ShowSingleService.DeleteImage(&deleteImageRequest); err != nil {
		err.Logging()
		c.JSON(err.StatusCode, gin.H{"error": err})
	}
	c.Status(http.StatusNoContent)
}

func DeleteAllShowSingleController(c *gin.Context) {
	var deleteAllRequest model.DeleteAllRequest

	// リクエストボディを構造体にバインド
	if err := c.ShouldBindJSON(&deleteAllRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := ShowSingleService.DeleteAllImage(&deleteAllRequest); err != nil {
		err.Logging()
		c.JSON(err.StatusCode, gin.H{"error": err})
	}
	c.Status(http.StatusNoContent)
}
